import { getMimeType } from "../Utils/helpers";
import axios from "./axios";

const PART_SIZE = 25 * 1024 * 1024; // 25MB per part
const MULTIPART_THRESHOLD = 3 * 1024 * 1024 * 1024; // Use multipart for files > 3 GB

/**
 * Upload file using simple PUT (for files < 100MB)
 */
const uploadFileSimple = async (file, dirId, setProgressMap, showModal) => {
  try {
    // Step 1: Initiate upload
    const uploadData = await uploadFileInitiate({
      name: file.name,
      size: file.size,
      contentType: file.type || getMimeType(file),
      parentDirId: dirId,
      isMultipart: false,
    });

    if (!uploadData.success) {
      showModal(
        "Error",
        uploadData.message || "Upload initiation failed.",
        "error"
      );
      setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
      return;
    }

    const { fileId, uploadURL } = uploadData.data || {};
    if (!fileId || !uploadURL) {
      throw new Error("Upload initiation response missing required fields.");
    }

    // Step 2: Upload file to S3
    await axios.put(uploadURL, file, {
      headers: {
        "Content-Type": file.type || getMimeType(file),
      },
      onUploadProgress: (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
        }
      },
    });

    // Step 3: Complete file upload (notify backend)
    const finalResponse = await uploadComplete(fileId, []);
    if (finalResponse.success) {
      setProgressMap((prev) => {
        const updated = { ...prev };
        delete updated[file.name];
        return updated;
      });
    } else {
      throw new Error(finalResponse.message || "Failed to complete upload.");
    }
  } catch (err) {
    console.error(`Upload failed for ${file.name}:`, err);
    setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
    showModal(
      "Upload Failed",
      err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during upload.",
      "error"
    );
  }
};

/**
 * Upload file using multipart upload (for files >= 100MB)
 */
const MAX_PARALLEL_UPLOADS = 5;

const uploadFileMultipart = async (file, dirId, setProgressMap, showModal) => {
  let uploadData;
  try {
    uploadData = await uploadFileInitiate({
      name: file.name,
      size: file.size,
      contentType: file.type || getMimeType(file),
      parentDirId: dirId,
      isMultipart: true,
    });

    if (!uploadData.success) {
      showModal(
        "Error",
        uploadData.message || "Upload initiation failed.",
        "error"
      );
      setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
      return;
    }

    const { fileId, uploadId } = uploadData.data || {};
    if (!fileId || !uploadId) {
      throw new Error("Upload initiation missing fileId or uploadId");
    }

    const totalParts = Math.ceil(file.size / PART_SIZE);
    const partProgress = new Array(totalParts).fill(0);
    const uploadedParts = [];

    const updateOverallProgress = () => {
      const totalProgress = partProgress.reduce((acc, p) => acc + p, 0);
      const percent = Math.round((totalProgress / totalParts) * 100);
      setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
    };

    const uploadPart = async (partNumber) => {
      const start = (partNumber - 1) * PART_SIZE;
      const end = Math.min(start + PART_SIZE, file.size);
      const chunk = file.slice(start, end);

      const partUrlResponse = await getPartPresignedURL({
        fileId,
        partNumber,
      });

      if (!partUrlResponse.success) {
        throw new Error("Failed to get URL for part " + partNumber);
      }

      const { presignedURL } = partUrlResponse.data;

      const response = await axios.put(presignedURL, chunk, {
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            partProgress[partNumber - 1] = event.loaded / chunk.size;
            updateOverallProgress();
          }
        },
      });

      const eTag = response.headers.etag;
      if (!eTag) throw new Error("Missing ETag for part " + partNumber);

      uploadedParts.push({
        partNumber,
        eTag,
      });
    };

    for (let i = 1; i <= totalParts; i += MAX_PARALLEL_UPLOADS) {
      const batch = [];

      for (let j = i; j < i + MAX_PARALLEL_UPLOADS && j <= totalParts; j++) {
        batch.push(uploadPart(j));
      }

      await Promise.all(batch);
    }

    const finalResponse = await uploadComplete(fileId, uploadedParts);

    if (finalResponse.success) {
      setProgressMap((prev) => {
        const updated = { ...prev };
        delete updated[file.name];
        return updated;
      });
    } else {
      throw new Error(finalResponse.message || "Upload complete failed");
    }
  } catch (err) {
    console.error("Multipart upload failed for " + file.name, err);

    setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));

    if (uploadData?.data?.uploadId) {
      try {
        await abortUpload(uploadData.data.fileId);
      } catch {}
    }

    showModal(
      "Upload Failed",
      err.response?.data?.message || err.message,
      "error"
    );
  }
};

/**
 * Unified upload function that chooses simple or multipart based on file size
 */
const uploadFile = async (file, dirId, setProgressMap, showModal) => {
  if (file.size > MULTIPART_THRESHOLD) {
    return uploadFileMultipart(file, dirId, setProgressMap, showModal);
  } else {
    return uploadFileSimple(file, dirId, setProgressMap, showModal);
  }
};

/**
 * Upload files in batches (5 at a time)
 */
export const uploadInBatches = async (
  files,
  batchSize = 5,
  dirId,
  setProgressMap,
  showModal
) => {
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (file) => {
        try {
          await uploadFile(file, dirId, setProgressMap, showModal);
        } catch (err) {
          console.error(`Upload failed for ${file.name}:`, err);
          setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
        }
      })
    );
  }
};

// API calls
const uploadFileInitiate = async (fileData) => {
  try {
    const response = await axios.post("/file/upload/initiate", fileData);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

const getPartPresignedURL = async ({ fileId, partNumber }) => {
  try {
    const response = await axios.get(
      `/file/upload/part-url/${fileId}?partNumber=${partNumber}`
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

const uploadComplete = async (fileId, parts) => {
  try {
    const response = await axios.post(`/file/upload/complete/${fileId}`, {
      parts,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

const abortUpload = async (fileId) => {
  try {
    const response = await axios.post(`/file/upload/abort/${fileId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
