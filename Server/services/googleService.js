import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import Directory from "../models/dirModel.js";
import File from "../models/fileModel.js";
import User from "../models/userModel.js";

export const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" // Redirect URI...
);

export async function verifyGoogleCode(code) {
  try {
    const { tokens } = await client.getToken(code); // tokens includes id_token, access_token
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to verify Google code: " + error.message);
  }
}

export const connectGoogleDrive = async (code, user) => {
  const drive = google.drive({ version: "v3", auth: client });
  const { tokens } = await client.getToken(code);
  client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  await User.findByIdAndUpdate(user._id, {
    $set: {
      google_access_token: tokens.access_token,
      google_refresh_token: tokens.refresh_token,
    },
  });

  const folders = await listNestedDriveFiles(drive);
  await saveFilesAndFolders(folders, drive, user);
  return;
};

const listNestedDriveFiles = async (drive) => {
  let allFiles = [];
  let nextPageToken = null;

  do {
    const res = await drive.files.list({
      pageSize: 100,
      fields: "nextPageToken, files(id, name, mimeType, parents)",
      pageToken: nextPageToken,
      q: "trashed = false",
    });

    allFiles = allFiles.concat(res.data.files);
    nextPageToken = res.data.nextPageToken;
  } while (nextPageToken);

  const folderMap = {}; // folderId → folderNode
  const rootFolders = []; // array of top-level folders
  const fileMap = {}; // fileId → file

  // Step 1: Create folder nodes
  for (const file of allFiles) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      folderMap[file.id] = {
        id: file.id,
        name: file.name,
        folders: [],
        files: [],
      };
    } else {
      fileMap[file.id] = file;
    }
  }

  // Step 2: Build folder hierarchy (nesting)
  for (const folderId in folderMap) {
    const folder = folderMap[folderId];
    const parentId = allFiles.find((f) => f.id === folderId)?.parents?.[0];

    if (parentId && folderMap[parentId]) {
      folderMap[parentId].folders.push(folder);
    } else {
      rootFolders.push(folder); // top-level folder
    }
  }

  // Step 3: Place files inside folders
  for (const file of allFiles) {
    if (file.mimeType !== "application/vnd.google-apps.folder") {
      const parentId = file.parents?.[0];

      const fileInfo = {
        id: file.id,
        name: file.name,
        mimeType: file.mimeType,
      };

      if (parentId && folderMap[parentId]) {
        folderMap[parentId].files.push(fileInfo);
      } else {
        // file in root
        let rootFolder = rootFolders.find((f) => f.name === "My Drive");
        if (!rootFolder) {
          rootFolder = {
            id: "root",
            name: "My Drive",
            folders: [],
            files: [],
          };
          rootFolders.push(rootFolder);
        }
        rootFolder.files.push(fileInfo);
      }
    }
  }

  return rootFolders;
};

const saveFilesAndFolders = async (Allfolders, drive, user) => {
  // Create a google drive Folder in Root Folder if not exist.
  let rootFolderId;
  const googleFolder = await Directory.findOne({
    name: "Google Drive",
    userId: user._id,
  })
    .select("_id")
    .lean();

  if (!googleFolder) {
    const newRootFolder = await Directory.create({
      name: "Google Drive",
      parentDirId: user.rootDirId,
      userId: user._id,
    });
    rootFolderId = newRootFolder._id;
  } else {
    rootFolderId = googleFolder._id;
  }

  for (const folder of Allfolders) {
    await saveFolder(folder, drive, rootFolderId, user._id);
  }

  return;
};

export const saveFolder = async (folderData, drive, parentFolderId, userId) => {
  const { name, folders = [], files = [] } = folderData;

  let currentFolder = await Directory.findOne({
    name,
    parentDirId: parentFolderId,
    userId,
  }).lean();

  if (!currentFolder) {
    currentFolder = await Directory.create({
      name,
      parentDirId: parentFolderId,
      userId,
    });
  }

  for (const file of files) {
    const alreadyExists = await File.findOne({
      googleFileId: file.id,
      parentDirId: currentFolder._id,
      userId,
    }).lean();

    if (!alreadyExists) {
      await File.create({
        storedName: file.name,
        name: file.name,
        googleFileId: file.id,
        mimeType: file.mimeType,
        parentDirId: currentFolder._id,
        userId,
      });
    }
  }

  for (const subFolder of folders) {
    await saveFolder(subFolder, drive, currentFolder._id, userId);
  }
};
