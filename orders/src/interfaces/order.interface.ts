import mongoose from "mongoose";
import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";

export interface IOrder {
  status: ORDER_STATUS;
  expiresAt: string | Date;
  userId: string;
  ticketId: string;
}

export interface IOrderDoc extends mongoose.Document, IOrder {}

export interface IOrderAttrs extends IOrder {}

export interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}
