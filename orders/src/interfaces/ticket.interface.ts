import mongoose from "mongoose";

export interface ITicket {
  title: string;
  price: number;
}
export interface ITicketDoc extends mongoose.Document, ITicket {
  isReserved(): Promise<boolean>;
}

export interface ITicketAttrs extends ITicket {}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
}
