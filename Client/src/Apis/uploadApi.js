import { formatFileSize, getMimeType } from "../Utils/helpers";
import axios from "./axios";

export const uploadFile = async (file, dirId, setProgressMap, showModal) => {
  try {
    // Step 1: Initiate upload
    const uploadData = await uploadFileInitiate({
      name: file.name,
      size: file.size,
      contentType: file.type || getMimeType(file),
      parentDirId: dirId,
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
    const finalResponse = await uploadComplete(fileId);
    if (finalResponse.success) {
      // Remove from progress map once done
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

export default uploadFile;

// Uploads 5 files at a time, waits until they finish, then moves to the next 5.
export const uploadInBatches = async (
  files,
  batchSize = 5, // or MAX_CONCURRENT_UPLOADS
  dirId,
  setProgressMap,
  setStorageData,
  storageData,
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

const uploadFileInitiate = async (fileData) => {
  try {
    const response = await axios.post("/file/upload/initiate", fileData);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

const uploadComplete = async (fileId) => {
  try {
    const response = await axios.post(`/file/upload/complete/${fileId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
