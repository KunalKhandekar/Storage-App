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
  },
  {
    strict: "throw",
  }
);

const Directory = model("Directory", dirSchema);
export default Directory;
