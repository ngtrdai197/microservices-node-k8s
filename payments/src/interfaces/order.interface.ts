import mongoose from "mongoose";
import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";

export interface IOrder {
    price: number;
    userId: string;
    version: number;
    status: ORDER_STATUS;
}

export interface IOrderDoc extends mongoose.Document, IOrder {}

export interface IOrderAttrs extends IOrder {
    id: string;
}

export interface IOrderModel extends mongoose.Model<IOrderDoc> {
    build(attrs: IOrderAttrs): IOrderDoc;

    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<IOrderDoc | null>;
}
