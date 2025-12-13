import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const cloudfrontDistributionDomain = process.env.CLOUDFRONT_URL;
const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
const keyPairId = process.env.KEY_PAIR_ID;

/**
 * Sanitizes a filename to contain only safe, printable ASCII characters (ISO-8859-1 compatible).
 * Removes any Unicode characters (e.g., accents, emojis, non-Latin scripts).
 */
const sanitizeFilenameASCII = (filename) => {
  const unique = Date.now().toString(36);

  if (!filename || typeof filename !== "string") {
    return `download-${unique}`;
  }

  // If filename is already safe ASCII, keep it
  if (/^[\x20-\x7E]+$/.test(filename)) {
    return filename;
  }

  // Keep extension if exists
  const ext = filename.match(/\.[a-zA-Z0-9]+$/)?.[0] || "";

  return `download-${unique}${ext}`;
};


export const getCloudFrontSignedURL = ({ File, Action, expiresIn = 3600 }) => {
  const fileName = File.name;
  let Key = File.originalKey;

  if (Action !== "download" && File.googleFileId && File.pdfKey) {
    Key = File.pdfKey;
  }

  const safeFileName = sanitizeFilenameASCII(fileName);
  const encodedDisposition = encodeURIComponent(
    `${Action === "download" ? "attachment" : "inline"}; filename="${safeFileName}"`
  );

  const url = `${cloudfrontDistributionDomain}/${Key}?response-content-disposition=${encodedDisposition}`;

  const dateLessThan = new Date(Date.now() + expiresIn * 1000);

  return getSignedUrl({
    url,
    keyPairId,
    dateLessThan,
    privateKey,
  });
};
