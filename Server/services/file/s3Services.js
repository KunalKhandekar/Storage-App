import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ profile: "storageApp" });
const bucket = "file-bucket-manager";

export const generatePreSignedUploadURL = async ({ Key, ContentType }) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key,
    ContentType,
  });

  const preSignedUploadURL = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type"]),
  });
  return preSignedUploadURL;
};

export const generatePreSigendGetURL = async ({ Key, Action, Filename  }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key,
    ResponseContentDisposition:
      Action === "download"
        ? `attachment; filename="${Filename}"`
        : `inline; filename="${Filename}"`, // allows browser preview
  });

  const preSigendGetURL = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });

  return preSigendGetURL;
};

export const getFileContentLength = async ({ Key }) => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key,
  });

  const metaData = await s3Client.send(command);
  return metaData?.ContentLength;
};
