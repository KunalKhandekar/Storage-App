import { rm } from "node:fs/promises";
import path from "node:path";
import { absolutePath } from "../app.js";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";

export const getDir = async (req, res) => {
  const { uid } = req.cookies;
  const { id } = req.params;

  try {
    const directoryData = id
      ? await Directory.findOne({
          _id: id,
          userId: req.user._id,
        }).lean()
      : await Directory.findOne({
          userId: uid,
        }).lean();

    if (!directoryData)
      return res.status(400).json({ error: "Unathorized Access" });

    const files = (
      await File.find({ parentDirId: directoryData?._id }).lean()
    ).map((file) => ({ ...file, type: "file" }));

    const directory = (
      await Directory.find({ parentDirId: directoryData?._id }).lean()
    ).map((dir) => ({ ...dir, type: "directory" }));

    res.status(200).json({ ...directoryData, files, directory });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Failed to get directory details" });
  }
};

export const updateDir = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { name } = req.body;

  try {
    await Directory.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: { name } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Directory Renamed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to update" });
  }
};

export const createDir = async (req, res) => {
  const user = req.user;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const { dirname } = req.headers;

  try {
    const dirObj = await Directory.findOne({
      _id: parentDirId,
      userId: req.user._id,
    }).lean();

    if (!dirObj) return res.status(400).json({ error: "Unathorized Access" });

    const dir = new Directory({
      name: dirname,
      parentDirId,
      userId: dirObj.userId,
    });

    console.log(dir);
    await dir.save();
    res.status(200).json({ message: "Directory Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to create folder" });
  }
};

export const deleteDir = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const deleteDirectory = async (id) => {
    let directories = await Directory.find(
      { parentDirId: id },
      { projection: { _id: 1 } }
    ).lean();

    let files = await File.find({ parentDirId: id })
      .select("storedName")
      .lean();

    for (const { _id } of directories) {
      const { directories: childDirs, files: childFiles } =
        await deleteDirectory(_id);
      files = [...files, ...childFiles];
      directories = [...directories, ...childDirs];
    }

    return { directories, files };
  };

  try {
    const dirObj = await Directory.findOne(
      {
        _id: id,
        userId: user._id,
      },
      { projection: { _id: 1 } }
    ).lean();

    if (!dirObj) return res.status(400).json({ error: "Unathorized Access" });

    const { files, directories } = await deleteDirectory(id);

    const includeThisDir = [...(directories?.map((dir) => dir._id) || []), id];

    await Directory.deleteMany({ _id: { $in: includeThisDir } });

    console.log(files);

    for (const { storedName } of files) {
      await rm(path.join(absolutePath, storedName));
    }

    await File.deleteMany({ _id: { $in: files?.map((file) => file._id) } });

    res.status(200).json({ message: "File Deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to delete" });
  }
};
