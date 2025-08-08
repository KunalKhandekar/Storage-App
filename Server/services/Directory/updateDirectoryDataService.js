import Directory from "../../models/dirModel.js";

export const updateDirectoryDataService = async (userId, dirId, name) => {
  try {
    await Directory.findOneAndUpdate(
      { _id: dirId, userId },
      { $set: { name } },
      { new: true, runValidators: true }
    );
  } catch (error) {
    throw error;
  }
};
