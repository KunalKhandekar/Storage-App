import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.AWS_BUCKET;

/**
 * Initiate multipart upload and return uploadId
 */
export const initiateMultipartUpload = async ({ Key, ContentType }) => {
  const command = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key,
    ContentType,
  });

  const response = await s3Client.send(command);
  if (!response.UploadId) {
    throw new Error("Failed to create multipart upload");
  }

  return response.UploadId;
};

/**
 * Generate presigned URL for a specific part
 */
export const generatePartPresignedURL = async ({
  Key,
  uploadId,
  partNumber,
}) => {
  const command = new UploadPartCommand({
    Bucket: bucket,
    Key,
    PartNumber: partNumber,
    UploadId: uploadId,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // 1 hour per part
  });

  // uploadId and partNumber as query params for backend tracking
  return `${url}&uploadId=${uploadId}&partNumber=${partNumber}`;
};

/**
 * Complete multipart upload with all part ETags
 */
export const completeMultipartUpload = async ({ Key, uploadId, parts }) => {
  const command = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts
        .map((p) => ({
          ETag: p.eTag,
          PartNumber: p.partNumber,
        }))
        .sort((a, b) => a.PartNumber - b.PartNumber),
    },
  })

  const res = await s3Client.send(command)
  console.log("Multipart upload completed:", res);
}


/**
 * Abort multipart upload (cleanup on failure)
 */
export const abortMultipartUpload = async ({ Key, uploadId }) => {
  const command = new AbortMultipartUploadCommand({
    Bucket: bucket,
    Key,
    UploadId: uploadId,
  });

  await s3Client.send(command);
};

/**
 * Generate presigned URL for simple PUT upload (files < 100MB)
 */
export const generatePreSignedUploadURL = async ({ Key, ContentType }) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key,
    ContentType,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 300,
    signableHeaders: new Set(["content-type"]),
  });
};

/**
 * Generate presigned get URL for downloading or viewing files
 */
export const generatePreSigendGetURL = async ({ Key, Action, Filename }) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key,
    ResponseContentDisposition:
      Action === "download"
        ? `attachment; filename="${Filename}"`
        : `inline; filename="${Filename}"`,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
};

/**
 * Get content length of an S3 object
 */
export const getFileContentLength = async ({ Key }) => {
  const command = new HeadObjectCommand({
    Bucket: bucket,
    Key,
  });

  const metaData = await s3Client.send(command);
  return metaData?.ContentLength || 0;
};

/**
 * Delete a single S3 object
 */
export const deleteS3Object = async ({ Key }) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key,
  });

  return await s3Client.send(command);
};

/**
 * Delete multiple S3 objects
 */
export const deleteS3Objects = async ({ Keys }) => {
  const command = new DeleteObjectsCommand({
    Bucket: bucket,
    Delete: {
      Objects: Keys.map((k) => ({ Key: k })),
      Quiet: false,
    },
  });

  return await s3Client.send(command);
};

