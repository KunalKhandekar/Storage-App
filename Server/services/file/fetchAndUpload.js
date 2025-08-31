import { Upload } from "@aws-sdk/lib-storage";
import axios from "axios";
import { s3Client } from "./s3Services.js";

export async function fetchAndUpload({
  url,
  headers,
  params,
  key,
  bucket,
  contentType,
}) {
  const resp = await axios({
    method: "GET",
    url,
    headers,
    responseType: "stream",
    params,
  });
  if (resp.status >= 400) throw new Error(`Drive API error ${resp.status}`);

  let size = 0;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: key,
      Body: resp.data,
      ContentType: contentType || resp.headers["content-type"],
    },
  });

  // Listen for progress events
  upload.on("httpUploadProgress", (progress) => {
    if (progress.loaded) size = progress.loaded;
  });

  await upload.done();

  return { key, size };
}
