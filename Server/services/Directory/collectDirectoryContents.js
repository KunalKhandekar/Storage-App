import Directory from "../../models/dirModel.js";
import File from "../../models/fileModel.js";

// Recursively finds all child directories & files under a given directory
export const collectDirectoryContents = async (dirId) => {
  let directories = await Directory.find(
    { parentDirId: dirId },
    { projection: { _id: 1 } }
  ).lean();

  let files = await File.find({ parentDirId: dirId })
    .select("storedName googleFileId")
    .lean();

  for (const { _id } of directories) {
    const { directories: childDirs, files: childFiles } =
      await collectDirectoryContents(_id);

    files = [...files, ...childFiles];
    directories = [...directories, ...childDirs];
  }

  return { directories, files };
};
