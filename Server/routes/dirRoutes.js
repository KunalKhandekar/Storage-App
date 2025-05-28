import { Router } from "express";
import { rm } from "node:fs/promises";
import path from "node:path";
import { absolutePath } from "../app.js";

import { ObjectId } from "mongodb";
import validateRequest from "../middlewares/validateRequest.js";

const router = Router();

router.get("/{:id}", async (req, res) => {
  const db = req.db;
  const { uid } = req.cookies;
  const { id } = req.params;

  try {
    const directoryData = id
      ? await db.collection("directories").findOne({
        _id: new ObjectId(String(id)),
        userId: req.user._id,
      })
      : await db.collection("directories").findOne({
        userId: new ObjectId(String(uid)),
        userId: req.user._id,
      });

    if (!directoryData)
      return res.status(400).json({ error: "Unathorized Access" });

    const files = (
      await db
        .collection("files")
        .find({ parentDirId: new ObjectId(directoryData?._id) })
        .toArray()
    ).map((file) => ({ ...file, type: "file" }));

    const directory = (
      await db
        .collection("directories")
        .find({ parentDirId: directoryData?._id })
        .toArray()
    ).map((dir) => ({ ...dir, type: "directory" }));

    res.status(200).json({ ...directoryData, files, directory });
  } catch (error) {
    res.status(404).json({ message: "Failed to get directory details" });
  }
});

router.post("/{:parentDirId}", async (req, res) => {
  const user = req.user;
  const db = req.db;
  const parentDirId = req.params.parentDirId || user.rootDirId;
  const { dirname } = req.headers;

  try {
    const dirObj = await db.collection("directories").findOne({
      _id: new ObjectId(parentDirId),
      userId: req.user._id,
    });

    if (!dirObj)
      return res.status(400).json({ error: "Unathorized Access" });

    await db.collection("directories").insertOne({
      name: dirname,
      parentDirId: new ObjectId(parentDirId),
      userId: user._id,
    });

    res.status(200).json({ message: "Directory Created" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to create folder" });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const { name } = req.body;
  const db = req.db;

  try {
    await db.collection("directories").updateOne(
      { _id: new ObjectId(String(id)), userId: user._id },
      { $set: { name: name } }
    );

    res.status(200).json({ message: "Directory Renamed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to update" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = req.db;
  const user = req.user;

  const deleteDirectory = async (id) => {
    let directories = await db
      .collection("directories")
      .find({ parentDirId: id }, { projection: { _id: 1 } })
      .toArray();

    let files = await db
      .collection("files")
      .find({ parentDirId: id }, { projection: { _id: 1, storedName: 1 } })
      .toArray();

    for (const { _id } of directories) {
      const { directories: childDirs, files: childFiles } =
        await deleteDirectory(_id);
      files = [...files, ...childFiles];
      directories = [...directories, ...childDirs];
    }

    return { directories, files };
  };

  try {
    const dirObj = await db.collection("directories").findOne({
      _id: new ObjectId(id),
      userId: user._id,
    }, { projection: { _id: 1 } });

    if (!dirObj)
      return res.status(400).json({ error: "Unathorized Access" });

    const { files, directories } = await deleteDirectory(new ObjectId(id));

    const includeThisDir = [
      ...(directories?.map((dir) => dir._id) || []),
      new ObjectId(id),
    ];

    await db
      .collection("directories")
      .deleteMany({ _id: { $in: includeThisDir } });

    for (const { storedName } of files) {
      await rm(path.join(absolutePath, storedName));
    }

    await db
      .collection("files")
      .deleteMany({ _id: { $in: files?.map((file) => file._id) } });

    res.status(200).json({ message: "File Deleted" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Failed to delete" });
  }
});

router.param("id", validateRequest);
router.param("pzrentDirId", validateRequest);

export default router;
