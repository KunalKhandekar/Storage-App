import axios from "axios";
import { getExportMimeType } from "../../utils/getExtension&MimeType.js";

export async function getGoogleFileSize(file, token) {
  try {
    // First try normal Drive metadata (for real files)
    const metaRes = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${file.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { fields: "size, mimeType" }
      }
    );

    if (metaRes.data.size) {
      return Number(metaRes.data.size);
    }

    // If Google Doc — size = null, so export and measure size
    const isGoogleNative = file.mimeType?.startsWith("application/vnd.google-apps");
    if (isGoogleNative) {
      const exportMime = getExportMimeType(file.mimeType);

      const exportRes = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${file.id}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { mimeType: exportMime },
          responseType: "arraybuffer",
        }
      );

      return exportRes.data.byteLength || 0;
    }

    return 0;
  } catch (err) {
    console.log("size fetch error:", err.message);
    return 0;
  }
}
