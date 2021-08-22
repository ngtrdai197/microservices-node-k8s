import mongoose from "mongoose";

export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketAttrs {
  title: string;
  price: number;
  userId: string;
}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
}