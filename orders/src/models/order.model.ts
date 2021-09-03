import mongoose from "mongoose";
import { IOrderDoc, IOrderModel, ORDER_STATUS } from "../interfaces/order.interface";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    expiredAt: {
      type: Date,
      require: true,
    },
    ticketId: {
      type: String,
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
  "Ticket",
  orderSchema
);
