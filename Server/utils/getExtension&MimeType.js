import path from "path";
import mime from "mime-types";

// Mapping for Google-specific formats
const googleMimeToExt = {
  "application/vnd.google-apps.document": "docx",
  "application/vnd.google-apps.spreadsheet": "xlsx",
  "application/vnd.google-apps.presentation": "pptx",
  "application/vnd.google-apps.drawing": "png",
};

export function getFileExtension(originalName, mimeType) {
  let ext = path.extname(originalName);

  // If no extension, try mapping Google MIME types
  if (!ext && googleMimeToExt[mimeType]) {
    ext = `.${googleMimeToExt[mimeType]}`;
  }

  // If still no extension, fallback to mime-types lib
  if (!ext) {
    const mimeExt = mime.extension(mimeType);
    ext = mimeExt ? `.${mimeExt}` : ".bin";
  }

  return ext;
}

// if you handle Google Docs export mapping:
export function getExportMimeType(mimeType) {
  switch (mimeType) {
    case "application/vnd.google-apps.document":
      return "application/pdf";
    case "application/vnd.google-apps.spreadsheet":
      return "application/pdf";
    case "application/vnd.google-apps.presentation":
      return "application/pdf";
    default:
      return "application/pdf";
  }
}