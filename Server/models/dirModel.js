import { model, Schema } from "mongoose";

const dirSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    size: {
      type: Number,
      required: true,
      default: 0,
    },
    path: [
      {
        type: Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

const Directory = model("Directory", dirSchema);
export default Directory;
