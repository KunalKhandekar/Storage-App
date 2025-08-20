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
    // For File-Sharing
    sharedViaLink: {
      token: {
        type: String,
      },
      enabled: {
        type: Boolean,
        default: false,
      },
      permission: {
        type: String,
        enum: ["viewer", "editor"],
        default: "viewer",
      },
    },
    sharedWith: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        }
      },
    ],
    size: {
      type: Number,
      required: true,
    }
  },
  {
    strict: "throw",
    timestamps: true
  },
);

const File = model("File", fileSchema);
export default File;
