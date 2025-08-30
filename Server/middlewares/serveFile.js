import { extname } from "node:path";
import { getCloudFrontSignedURL } from "../services/file/cloudFront.js";

export const serveFile = async (req, res, next) => {
  const fileObj = req.file;
  try {
    const s3URL = getCloudFrontSignedURL({
      Key: `${fileObj._id}${extname(fileObj.name)}`,
      Action: req.query.action,
      Filename: fileObj.name,
    });

    return res.redirect(s3URL);
  } catch (error) {
    next(error);
  }
};
