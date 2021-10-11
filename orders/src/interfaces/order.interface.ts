import mongoose from "mongoose";
import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";
import { ITicketDoc } from "./ticket.interface";

export interface IOrder {
  status: ORDER_STATUS;
  expiresAt: string | Date;
  userId: string;
  ticket: string | ITicketDoc;
  version: number;
}

export interface IOrderDoc extends mongoose.Document, IOrder {}

type OrderBuildType = Omit<IOrder, "version">;

export interface IOrderAttrs extends OrderBuildType {}

export interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}

export interface IOrderCancelledEvent {
  
}