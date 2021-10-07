import {
  TicketUpdatedEvent,
  ITicketUpdated,
  Subjects,
  NotFoundError,
} from "@dnt-ticketing-mvc/common";
import { Listener } from "@dnt-ticketing-mvc/common/build/events/base/base.listener";
import { Message } from "node-nats-streaming";
import { ticketModel } from "../models/ticket.model";

export class TicketUpdatedListener extends Listener<
  TicketUpdatedEvent,
  ITicketUpdated
> {
  public readonly subject = Subjects.TicketUpdated;
  public readonly queueGroupName = "ORDERS_SERICE"; //QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: ITicketUpdated, msg: Message) {
    console.log(`${TicketUpdatedListener} =>`, data);
    const ticket = await ticketModel.findById(data.id);
    if (!ticket) {
      throw new NotFoundError("Ticket not exists");
    }
    const { price, title } = data;
    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
