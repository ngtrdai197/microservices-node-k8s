import mongoose from "mongoose";
import { IOrderDoc, IOrderModel } from "../interfaces/order.interface";
import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: ORDER_STATUS.CREATED,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      require: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
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
  }
);
orderSchema.statics.build = (attrs: IOrderDoc) => new orderModel(attrs);

export const orderModel = mongoose.model<IOrderDoc, IOrderModel>(
  "Order",
  orderSchema
);
