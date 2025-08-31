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
      // Google Docs → Export as Word
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    case "application/vnd.google-apps.spreadsheet":
      // Google Sheets → Export as Excel
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    case "application/vnd.google-apps.presentation":
      // Google Slides → Export as PowerPoint
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";

    case "application/vnd.google-apps.drawing":
      // Google Drawings → Export as PNG
      return "image/png";

    default:
      // Fallback → PDF
      return "application/pdf";
  }
}
