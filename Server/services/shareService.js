import File from "../models/fileModel.js";

export const sharedByMeFiles = async (currentUserId) => {
  const sharedByMe = await File.find({
    userId: currentUserId,
    $or: [
      { "sharedViaLink.enabled": true },
      { sharedWith: { $not: { $size: 0 } } },
    ],
  })
    .populate("userId sharedWith.userId")
    .lean();

  return sharedByMe.map((f) => {
    const lastSharedAt = f.sharedWith?.at(-1)?.sharedAt;
    const modifiedAt = f.updatedAt;
    const latestTime = new Date(
      new Date(modifiedAt || 0) > new Date(lastSharedAt || 0)
        ? modifiedAt
        : lastSharedAt
    );
    return { ...f, latestTime };
  });
};

export const sharedWithMeFiles = async (currentUserId) => {
  return await File.find({
    "sharedWith.userId": currentUserId,
  })
    .populate("userId sharedWith.userId")
    .lean();
};
