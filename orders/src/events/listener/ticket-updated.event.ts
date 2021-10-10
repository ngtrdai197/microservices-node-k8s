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
    try {
      console.log(`${TicketUpdatedListener.name} =>`, data);
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
    } catch (error) {
      console.log("error :>> ", error);
      msg.ack();
    }
  }
}
