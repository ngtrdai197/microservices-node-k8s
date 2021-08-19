import mongoose from "mongoose";

export interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
}

export interface IFUserAttrs {
  email: string;
  password: string;
}

export interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IFUserAttrs): IUserDoc;
}

export interface IUserPayload {
  id: string;
  email: string;
}
