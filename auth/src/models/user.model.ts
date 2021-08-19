import mongoose from "mongoose";
import { IUserDoc, IUserModel } from "../interfaces/user.interface";
import { CryptoUtil } from "../utils/crypto.util";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await CryptoUtil.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: IUserDoc) => new userModel(attrs);

export const userModel = mongoose.model<IUserDoc, IUserModel>("User", userSchema);
