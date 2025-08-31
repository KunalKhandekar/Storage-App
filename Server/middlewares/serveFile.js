import { getCloudFrontSignedURL } from "../services/file/cloudFront.js";

export const serveFile = async (req, res, next) => {
  const fileObj = req.file;
  try {
    const s3URL = getCloudFrontSignedURL({
      File: fileObj,
      Action: req.query.action,
    });

    return res.redirect(s3URL);
  } catch (error) {
    next(error);
  }
};
