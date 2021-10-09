import { ORDER_STATUS } from "@dnt-ticketing-mvc/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return ticketModel.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
ticketSchema.statics.build = (attrs: ITicketDoc) =>
  new ticketModel({
    _id: attrs.id, // override ticket id in orders service by ticket id in ticket service
    ...attrs,
  });
ticketSchema.methods.isReserved = async function (userId: string) {
  const ticket = this;
  const existingOrder = await orderModel.findOne({
    ticket: ticket._id,
    status: {
      $in: [
        ORDER_STATUS.AWAITING_PAYMENT,
        ORDER_STATUS.CREATED,
        ORDER_STATUS.COMPLETE,
      ],
    },
    userId,
  });
  return !!existingOrder;
};

export const ticketModel = mongoose.model<ITicketDoc, ITicketModel>(
  "Ticket",
  ticketSchema
);
