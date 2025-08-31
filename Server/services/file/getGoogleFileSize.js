import axios from "axios";
import { getExportMimeType } from "../../utils/getExtension&MimeType.js";

export async function getGoogleFileSize(file, token) {
  const isGoogleNative = file.mimeType?.startsWith(
    "application/vnd.google-apps"
  );
  const url = isGoogleNative
    ? `https://www.googleapis.com/drive/v3/files/${file.id}/export`
    : `https://www.googleapis.com/drive/v3/files/${file.id}`;

  const params = isGoogleNative
    ? { mimeType: getExportMimeType(file.mimeType) }
    : { alt: "media" };

  const res = await axios.head(url, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return Number(res.headers["content-length"]) || 0;
}