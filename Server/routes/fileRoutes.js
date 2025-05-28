import { Router } from "express";
import { rm } from "fs/promises";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { absolutePath } from "../app.js";
import validateRequest from "../middlewares/validateRequest.js";

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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  const fileObj = await db.collection("files").findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileObj) {
    return res.status(404).json({ message: "File not found" });
  }

  const filePath = path.join(absolutePath, fileObj.storedName);

  if (req.query.action === "download") {
    return res.download(filePath, fileObj.name);
  }

  res.sendFile(filePath);
});

// UPLOAD file(s)
router.post("/upload", upload.array("myfiles", 5), async (req, res) => {
  const db = req.db;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const { originalname, storedName } = req.files[0];
  const parentDirId = req.headers.parentdirid || req.user.rootDirId;

  try {
    const parentDirectory = await db.collection("directories").findOne({
      _id: new ObjectId(parentDirId),
      userId: req.user._id,
    });

    if (!parentDirectory) {
      await rm(path.join(absolutePath, storedName));
      return res.status(400).json({
        error: "You are not authorized to upload file",
      });
    }

    await db.collection("files").insertOne({
      storedName,
      userId: req.user._id,
      name: originalname,
      parentDirId: parentDirectory._id,
    });

    res.status(200).json({ message: "File Uploaded" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Failed to Upload file" });
  }
});

// DELETE file
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  const fileObj = await db.collection("files").findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileObj) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    await db.collection("files").deleteOne({ _id: fileObj._id });
    await rm(path.join(absolutePath, fileObj.storedName));
    res.json({ message: "File Deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "File not found" });
  }
});

// PATCH (rename) file
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const db = req.db;

  const fileObj = await db.collection("files").findOne({
    _id: new ObjectId(id),
    userId: req.user._id,
  });

  if (!fileObj) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    await db.collection("files").updateOne(
      { _id: fileObj._id },
      { $set: { name } }
    );
    res.json({ message: "File Renamed" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
