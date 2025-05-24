import { Router } from "express";
import { rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { absolutePath } from "../app.js";
import dirsData from "../dirDB.json" with { type: "json" };
import filesData from "../filesDB.json" with { type: "json" };
import validateRequest from "../middlewares/validateRequest.js";


const router = Router();

const deleteDirectory = async (id) => {
  // Removing directory from DB.
  const dirIndex = dirsData?.findIndex((dir) => dir.id === id);
  const directoryData = dirsData[dirIndex];
  dirsData.splice(dirIndex, 1);

  // Removing Directory ID from parentObj (working)
  const parentDirectory = dirsData?.find((dir) => dir.id === directoryData?.parentDirId);
  const dirIndexInparent = parentDirectory?.directory?.findIndex((dirId) => dirId === id);
  parentDirectory?.directory?.splice(dirIndexInparent, 1);

  // Deleting each file from directory
  for (const fileId of directoryData?.files || []) {
    const fileIndex = filesData.findIndex((f) => f.id === fileId);
    const fileObj = filesData[fileIndex];
    const fileName = fileObj.id + fileObj.ext;
    await rm(path.join(absolutePath + fileName));
    filesData.splice(fileIndex, 1);
    await writeFile("./filesDB.json", JSON.stringify(filesData))
  };

  // Recursively delete subdirectories
  for (const dirId of directoryData?.directory || []) {
    await deleteDirectory(dirId);
  }
}

router.get('/{:id}', async (req, res) => {
  const { uid } = req.cookies;
  const { id } = req.params;
  const directoryData = id ? dirsData.find((folder) => folder.id === id) : dirsData.find((folder) => folder.userId === uid);
  try {
    const files = directoryData.files.map((fileId) => {
      const f = filesData.find((file) => file.id === fileId);
      f.type = "file";
      return f;
    });
    const directory = directoryData.directory.map((dirId) => {
      const dir = dirsData.find((dir) => dir.id === dirId);
      dir.type = "directory";
      return dir;
    });
    res.status(200).json({ ...directoryData, files, directory });
  } catch (error) {
    res.status(404).json({ message: "Failed to get directory details" });
  }
});

router.post("/{:parentDirId}", async (req, res) => {
  const user = req.user;
  console.log(user);
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const { dirname } = req.headers;
  const dirId = crypto.randomUUID()
  try {
    dirsData?.push({
      id: dirId,
      name: dirname,
      parentDirId,
      userId: user.id,
      files: [],
      directory: [],
    });
    const parentDirectory = dirsData.find((dir) => dir.id === parentDirId);
    parentDirectory?.directory?.push(dirId);
    console.log(dirsData);
    await writeFile("./dirDB.json", JSON.stringify(dirsData));
    res.status(200).json({ message: "Directory Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to create folder" });
  } 
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const directoryData = dirsData.find((folder) => folder.id === id);
    directoryData.name = name;
    await writeFile("./dirDB.json", JSON.stringify(dirsData));
    res.status(200).json({ message: "Directory Renamed" })
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to update" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteDirectory(id);
    await writeFile("./dirDB.json", JSON.stringify(dirsData))
    res.status(200).json({ message: "File Deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to delete" });
  }
})

router.param("id", validateRequest)
router.param("pzrentDirId", validateRequest)

export default router;
