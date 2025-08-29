import { google } from "googleapis";
import { extname } from "node:path";
import { client } from "../services/auth/googleService.js";
import { generatePreSigendGetURL } from "../services/file/s3Services.js";

export const serveFile = async (req, res, next) => {
  const fileObj = req.file;
  try {
    if (fileObj?.googleFileId) {
      client.setCredentials({
        access_token: req.user.google_access_token,
        refresh_token: req.user.google_refresh_token,
      });

      await client.getAccessToken();

      const drive = google.drive({ version: "v3", auth: client });
      const { googleFileId, storedName, mimeType } = fileObj;
      let streamRes;
      let filename = storedName;

      switch (mimeType) {
        case "application/vnd.google-apps.document":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType: "application/pdf",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".pdf";
          res.setHeader("Content-Type", "application/pdf");
          break;

        case "application/vnd.google-apps.spreadsheet":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".xlsx";
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
          break;

        case "application/vnd.google-apps.presentation":
          streamRes = await drive.files.export(
            {
              fileId: googleFileId,
              mimeType:
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            },
            { responseType: "stream" }
          );
          filename = storedName.replace(/\.[^/.]+$/, "") + ".pptx";
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          );
          break;

        default:
          streamRes = await drive.files.get(
            { fileId: googleFileId, alt: "media" },
            { responseType: "stream" }
          );
          res.setHeader("Content-Type", mimeType || "application/octet-stream");
          break;
      }

      // Get metadata to set file size
      const metadata = await drive.files.get({
        fileId: googleFileId,
        fields: "size",
      });

      if (metadata.data?.size) {
        res.setHeader("Content-Length", metadata.data.size);
      }

      if (req.query.action === "download") {
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${filename}"`
        );
      }

      return streamRes.data.pipe(res).on("error", (err) => {
        throw new CustomError(
          "File Streaming failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      });
    }

    const s3URL = await generatePreSigendGetURL({
      Key: `${fileObj._id}${extname(fileObj.name)}`,
      Action: req.query.action,
      Filename: fileObj.name,
    });

    return res.redirect(s3URL);
  } catch (error) {
    next(error);
  }
};
