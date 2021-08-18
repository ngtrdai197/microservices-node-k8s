import mongoose from "mongoose";

export interface IUserDocument extends mongoose.Document {
  email: string;
  password: string;
}

interface UserAttrs {
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUserDocument> {
  build(attrs: UserAttrs): IUserDocument;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attrs: IUserDocument) => new User(attrs);

export const User = mongoose.model<IUserDocument, IUserModel>(
  "User",
  userSchema
);
