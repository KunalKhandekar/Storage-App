import { Router } from "express";
import { rm, writeFile } from "fs/promises";
import multer from "multer";
import path from "path";
import { absolutePath } from "../app.js";
import dirsData from "../dirDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import validateRequest from "../middlewares/validateRequest.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'storage/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomID = crypto.randomUUID();
    file.ext = ext;
    file.randomID = randomID;
    const fullFileName = randomID + ext;
    cb(null, fullFileName);
  }
});

const upload = multer({ storage });

const router = Router();

router.param("id", validateRequest);

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const [fileObj] = filesData.filter((file) => file.id === id);
  if (!fileObj) return res.status(404).json({ message: "File not found" });
  const parentDirectory = dirsData.find((dir) => dir.id === fileObj.parentDirId);
  if (parentDirectory.userId !== req.user.id) return res.status(404).json({ error: "Access Denied" });
  const fileName = fileObj.id + fileObj.ext;
  const filePath = path.join(absolutePath, fileName)
  if (req.query.action === "download") {
    return res.download(filePath, fileObj.name);
  };
  res.sendFile(filePath);
});

router.post("/upload", upload.array('myfiles', 5), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  const { originalname, randomID, ext } = req.files[0];
  const parentDirId = req.headers.parentdirid || req.user.rootDirId;
  const parentDirectory = dirsData.find((dir) => dir.id === parentDirId);
  if (parentDirectory.userId !== req.user.id) return res.status(404).json({ error: "Access Denied" });

  try {
    filesData.push({
      id: randomID,
      ext,
      name: originalname,
      parentDirId,
    });
    parentDirectory?.files?.push(randomID);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./dirDB.json", JSON.stringify(dirsData));
    res.status(200).json({ message: "File Uploaded" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to Upload file" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const fileIndex = filesData.findIndex((file) => file.id === id);

  const fileObj = filesData[fileIndex];
  const parentDirectory = dirsData.find((dir) => dir.id === fileObj.parentDirId);

  if (parentDirectory.userId !== req.user.id) return res.status(404).json({ error: "Access Denied" });

  if (!fileObj) return res.status(404).json({ message: "file Not found" });
  const fileName = fileObj.id + fileObj.ext;
  try {
    await rm(path.join(absolutePath + fileName));
    filesData.splice(fileIndex, 1);
    parentDirectory.files = parentDirectory.files.filter((fileId) => fileId !== id);
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    await writeFile("./dirDB.json", JSON.stringify(dirsData));
    res.json({ message: "File Deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "File not found" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const [fileObj] = filesData.filter((file) => file.id === id);
  fileObj.name = name;
  const parentDirectory = dirsData.find((dir) => dir.id === fileObj.parentDirId);
  if (parentDirectory.userId !== req.user.id) return res.status(404).json({ error: "Access Denied" });
  try {
    await writeFile("./filesDB.json", JSON.stringify(filesData));
    res.json({ message: "File Renamed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "File not found" });
  }
});

export default router;
