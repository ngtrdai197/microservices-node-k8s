import mongoose from "mongoose";
import { ITicketDoc, ITicketModel } from "../interfaces/ticket.interface";

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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
  }
);
ticketSchema.statics.build = (attrs: ITicketDoc) => new ticketModel(attrs);

export const ticketModel = mongoose.model<ITicketDoc, ITicketModel>(
  "Ticket",
  ticketSchema
);
