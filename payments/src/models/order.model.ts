import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { IOrderDoc, IOrderModel } from "../interfaces/order.interface";

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: ORDER_STATUS,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            require: true,
        },
    },
    {
        toJSON: {
            transform: (_, ret) => {
                ret.id = ret._id;
                delete ret.__v;
                delete ret._id;
            },
        },
    },
);
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrderDoc) =>
    new orderModel({
        _id: attrs.id,
        ...attrs,
    });

orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return orderModel.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};

export const orderModel = mongoose.model<IOrderDoc, IOrderModel>(
    "Order",
    orderSchema,
);
