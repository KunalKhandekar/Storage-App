import File from "../../models/fileModel.js";

export const sharedWithMeFiles = async (currentUserId) => {
  return await File.find({
    "sharedWith.userId": currentUserId,
  })
    .populate("userId sharedWith.userId")
    .lean();
};