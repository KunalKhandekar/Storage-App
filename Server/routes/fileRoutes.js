import { Router } from "express";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import validateRequest from "../middlewares/validateRequest.js";
import {
  deleteFile,
  getFileById,
  renameFile,
  uploadFile,
} from "../controllers/fileControllers.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "storage/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    const fullFileName = `${randomID}${ext}`;
    file.ext = ext;
    file.storedName = fullFileName;
    cb(null, fullFileName);
  },
});

const upload = multer({ storage });
const router = Router();

router.param("id", validateRequest);

// GET file
router.get("/:id", getFileById);

// UPLOAD file(s)
router.post("/upload", upload.array("myfiles", 5), uploadFile);

// DELETE file
router.delete("/:id", deleteFile);

// PATCH (rename) file
router.patch("/:id", renameFile);

export default router;
