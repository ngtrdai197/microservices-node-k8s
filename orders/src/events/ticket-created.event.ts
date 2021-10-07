import { Message } from "node-nats-streaming";
import {
  ITicketCreated,
  Subjects,
  TicketCreatedEvent,
} from "@dnt-ticketing-mvc/common";
import { Listener } from "@dnt-ticketing-mvc/common/build/events/base/base.listener";
import { ticketModel } from "../models/ticket.model";

export class TicketCreatedListener extends Listener<
  TicketCreatedEvent,
  ITicketCreated
> {
  public readonly subject = Subjects.TicketCreated;
  public readonly queueGroupName = "ORDERS_SERICE"; //QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: ITicketCreated, msg: Message) {
    console.log(`${TicketCreatedListener.name} =>`, data);

    const ticket = ticketModel.build(data);
    await ticket.save();
    msg.ack();
  }
}
