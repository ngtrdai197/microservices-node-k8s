import {
  TicketUpdatedEvent,
  ITicketUpdated,
  Subjects,
  NotFoundError,
  QUEUE_GROUP_NAME,
  Listener,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import { ticketModel } from "../../models/ticket.model";

export class TicketUpdatedListener extends Listener<
  TicketUpdatedEvent,
  ITicketUpdated
> {
  public readonly subject = Subjects.TicketUpdated;
  public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: ITicketUpdated, msg: Message) {
    console.log(`${TicketUpdatedListener.name} =>`, data);
    const ticket = await ticketModel.findOne({
      _id: data.id,
      version: data.version,
    });
    if (!ticket) {
      throw new NotFoundError("Ticket not exists");
    }
    const { price, title } = data;
    ticket.set({ price, title });
    await ticket.save();

    msg.ack();
  }
}
