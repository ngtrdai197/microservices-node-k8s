import {
  ITicketUpdated,
  Listener,
  NotFoundError,
  QUEUE_GROUP_NAME,
  Subjects,
  TicketUpdatedEvent,
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
    const ticket = await ticketModel.findByEvent({
      id: data.id,
      version: data.version,
    });
    if (!ticket) {
      msg.ack();
      throw new NotFoundError("Ticket not exists");
    }
    const { price, title, numberOfSeat, isLocked } = data;
    ticket.set({ price, title, numberOfSeat, isLocked });
    await ticket.save();

    msg.ack();
  }
}
