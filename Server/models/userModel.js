import { compare, hash } from "bcrypt";
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
    picture: {
      type: String,
      required: true,
      default: function () {
        const encodedName = encodeURIComponent(this.name || "User");
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}`;
      },
    },
    role: {
      type: String,
      enum: ["SuperAdmin", "Admin", "Manager", "User"],
      default: "User",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdWith: {
      type: String,
      enum: ["email", "google", "github"],
      required: true,
    },
    canLoginWithPassword: {
      type: Boolean,
      required: true,
    },
    google_access_token: {
      type: String,
    },
    google_refresh_token: {
      type: String,
    },
  },
  {
    strict: "throw",
    methods: {
      comparePassword(candidatePassword) {
        return compare(candidatePassword, this.password);
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 10);
  next();
});

const User = model("User", userSchema);
export default User;
