import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const cloudfrontDistributionDomain = process.env.CLOUDFRONT_URL;
const privateKey = process.env.CLOUDFRONT_PRIVATE_KEY;
const keyPairId = process.env.KEY_PAIR_ID;

export const getCloudFrontSignedURL = ({ File, Action, expiresIn = 3600 }) => {
  const fileName = File.name;
  let Key = File.originalKey;

  if (Action !== "download" && File.googleFileId && File.pdfKey) {
    Key = File.pdfKey;
  }

  const encodedDisposition = encodeURIComponent(
    `${Action === "download" ? "attachment" : "inline"}; filename="${fileName}"`
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
