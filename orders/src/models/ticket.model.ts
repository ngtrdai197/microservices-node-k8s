import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";
import mongoose from "mongoose";
import { ITicketDoc, ITicketModel } from "../interfaces/ticket.interface";
import { orderModel } from "./order.model";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
      min: 0,
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
ticketSchema.statics.build = (attrs: ITicketDoc) =>
  new ticketModel({
    _id: attrs.id, // override ticket id in orders service by ticket id in ticket service
    ...attrs,
  });
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await orderModel.findOne({
    ticketId: this,
    status: {
      $in: [
        ORDER_STATUS.AWAITING_PAYMENT,
        ORDER_STATUS.CREATED,
        ORDER_STATUS.COMPLETE,
      ],
    },
  });
  return !!existingOrder;
};

export const ticketModel = mongoose.model<ITicketDoc, ITicketModel>(
  "Ticket",
  ticketSchema
);
