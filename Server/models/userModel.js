import { model, Schema } from "mongoose";
import bcrypt, { compare } from "bcrypt";

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
    methods: {
      comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = model("User", userSchema);
export default User;
