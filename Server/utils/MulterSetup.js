import multer from "multer";
import path from "path";
import { rootPath } from "../app.js";

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
