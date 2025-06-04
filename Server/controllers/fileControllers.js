import { rm } from "fs/promises";
import path from "path";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";

export const uploadFile = async (req, res) => {

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const { originalname, storedName } = req.files[0];
  const parentDirId = req.headers.parentdirid || req.user.rootDirId;

  try {
    const parentDirectory = await Directory.findOne({
      _id: parentDirId,
      userId: req.user._id,
    }).lean();

    if (!parentDirectory) {
      await rm(path.join(absolutePath, storedName));
      return res.status(400).json({
        error: "You are not authorized to upload file",
      });
    }

    await File.create({
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
};

export const getFileById = async (req, res) => {
  const { id } = req.params;

  const fileObj = await File.findOne({
    _id: id,
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
};

export const renameFile = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const fileObj = await File.findOne({
    _id: id,
    userId: req.user._id,
  }).lean();

  if (!fileObj) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    await File
      .updateOne({ _id: fileObj._id }, { $set: { name } }).lean();
    res.json({ message: "File Renamed" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "File not found" });
  }
};

export const deleteFile = async (req, res) => {
  const { id } = req.params;

  const fileObj = await File.findOne({
    _id: id,
    userId: req.user._id,
  });

  if (!fileObj) {
    return res.status(404).json({ message: "File not found" });
  }

  try {
    await File.deleteOne({ _id: fileObj._id });
    await rm(path.join(absolutePath, fileObj.storedName));
    res.json({ message: "File Deleted" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "File not found" });
  }
};
