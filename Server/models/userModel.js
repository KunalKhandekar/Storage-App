import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 3,
      required: true,
    },
    email: {
      type: String,
      match: /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
      required: true,
      trim: true,
    },
    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },
  },
  {
    strict: "throw",
  }
);

const User = model("User", userSchema);
export default User;
