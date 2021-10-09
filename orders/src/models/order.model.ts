import mongoose from "mongoose";
import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";
import { IOrderDoc, IOrderModel } from "../interfaces/order.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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
    ticket: {
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: IOrderDoc) => new orderModel(attrs);

export const orderModel = mongoose.model<IOrderDoc, IOrderModel>(
  "Order",
  orderSchema
);
