import mongoose from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: string;
  version: number;
}
export interface ITicketDoc extends mongoose.Document, ITicket {}

export interface ITicketAttrs extends ITicket {}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
}
