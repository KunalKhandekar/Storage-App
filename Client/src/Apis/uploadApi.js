import axios from "./axios";

const uploadFile = (file, dirId, setProgressMap) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("myfiles", file);

    axios
      .post("/file/upload", formData, {
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
      })
      .then(() => {
        setProgressMap((prev) => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
        resolve();
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        setProgressMap((prev) => ({ ...prev, [file.name]: "Failed" }));
        reject(err);
      });
  });
};

// Uploads 5 files at a time, waits until they finish, then moves to the next 5.
export const uploadInBatches = async (
  files,
  batchSize = MAX_CONCURRENT_UPLOADS,
  dirId,
  setProgressMap
) => {
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(
      batch.map((file) => uploadFile(file, dirId, setProgressMap))
    );
  }
};
