import { Message } from "node-nats-streaming";
import {
  ITicketCreated,
  Listener,
  QUEUE_GROUP_NAME,
  Subjects,
  TicketCreatedEvent,
} from "@dnt-ticketing-mvc/common";
import { ticketModel } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<
  TicketCreatedEvent,
  ITicketCreated
> {
  public readonly subject = Subjects.TicketCreated;
  public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: ITicketCreated, msg: Message) {
    const ticket = ticketModel.build(data);
    try {
      await ticket.save();
    } catch (e) {
      console.log(e);
    } finally {
      msg.ack();
    }
  }
}
