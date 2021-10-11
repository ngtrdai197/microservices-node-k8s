import mongoose from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  userId: string;
  version: number;
  numberOfSeat: number;
  isLocked: boolean;
}
export interface ITicketDoc extends mongoose.Document, ITicket {}

export interface ITicketAttrs
  extends Omit<ITicket, "version" | "isLocked" | "numberOfSeat"> {}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
}
