import mongoose from "mongoose";

export enum ORDER_STATUS {
  EXPIRED,
  PAID,
  PENDING,
}

export interface IOrder {
  status: ORDER_STATUS;
  expiredAt: string | Date;
  userId: string;
  ticketId: string;
}

export interface IOrderDoc extends mongoose.Document, IOrder {}

export interface IOrderAttrs extends IOrder {}

export interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}
