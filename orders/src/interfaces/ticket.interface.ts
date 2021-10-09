import mongoose from "mongoose";

export interface ITicket {
  title: string;
  price: number;
  version: number;
}
export interface ITicketDoc extends mongoose.Document, ITicket {
  isReserved(userId: string): Promise<boolean>;
}

export interface ITicketAttrs extends ITicket {}

export interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ITicketDoc | null>;
}
