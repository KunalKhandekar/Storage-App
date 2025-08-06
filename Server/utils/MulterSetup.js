import multer from "multer";
import path from "path";
import { absolutePath, rootPath } from "../app.js";

export const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, absolutePath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    const fullFileName = `${randomID}${ext}`;
    file.ext = ext;
    file.storedName = fullFileName;
    cb(null, fullFileName);
  },
});

export const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, rootPath+"/profilePictures"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    const fullFileName = `${randomID}${ext}`;
    file.ext = ext;
    file.storedName = fullFileName;
    cb(null, fullFileName);
  },
});
