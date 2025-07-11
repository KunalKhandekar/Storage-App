import { model, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    storedName: {
      type: String,
      required: true,
      trim: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // For GoogleDrive file
    googleFileId: {
      type: String,
    },
    // For GoogleDrive file
    mimeType: {
      type: String,
    },
    
  },
  {
    strict: "throw",
  }
);

const File = model("File", fileSchema);
export default File;
