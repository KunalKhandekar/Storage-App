import { formatFileSize } from "../Utils/helpers";
import axios from "./axios";

const uploadFile = async (file, dirId, setProgressMap) => {
  const formData = new FormData();
  formData.append("myfiles", file);

  try {
    await axios.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        parentdirid: dirId || "",
      },
      withCredentials: true,
      onUploadProgress: (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgressMap((prev) => ({ ...prev, [file.name]: percent }));
        }
      },
    });

    // Remove progress for this file
    setProgressMap((prev) => {
      const updated = { ...prev };
      delete updated[file.name];
      return updated;
    });
  } catch (err) {
    console.error(`Upload failed for ${file.name}:`, err);
    setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
    throw err;
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
  // Local tracker for available storage
  let availableStorage = storageData.availableStorageLimit;

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (file) => {
        if (file.size > availableStorage) {
          showModal(
            "Error",
            `Cannot upload "${file.name}" (${formatFileSize(file.size)}). 
            Only ${formatFileSize(availableStorage)} available.`,
            "error"
          );
          setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
          return;
        }

        try {
          await uploadFile(file, dirId, setProgressMap);
          availableStorage -= file.size;
          setStorageData((prev) => ({
            ...prev,
            availableStorageLimit: prev.availableStorageLimit - file.size,
          }));
        } catch (err) {
          console.error(`Upload failed for ${file.name}:`, err);
          setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
        }
      })
    );
  }
};
