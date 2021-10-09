import { Message } from "node-nats-streaming";
import {
  QUEUE_GROUP_NAME,
  Subjects,
  Listener,
  OrderCreatedEvent,
  IOrderCreated,
  NotFoundError,
} from "@dnt-ticketing-mvc/common";
import { ticketModel } from "../../models/ticket.model";

export class OrderCreatedListener extends Listener<
  OrderCreatedEvent,
  IOrderCreated
> {
  public readonly subject = Subjects.OrderCreated;
  public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_TICKETS;

  public async onMessage(data: IOrderCreated, msg: Message) {
    const ticket = await ticketModel.findById(data.ticket.id);
    if (!ticket) {
      throw new NotFoundError(
        "Can not found ticket with ID: " + data.ticket.id
      );
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    msg.ack();
  }
}
