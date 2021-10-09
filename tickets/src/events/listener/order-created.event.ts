import { Message } from "node-nats-streaming";
import {
  QUEUE_GROUP_NAME,
  Subjects,
  Listener,
  OrderCreatedEvent,
  IOrderCreated,
} from "@dnt-ticketing-mvc/common";

export class OrderCreatedListener extends Listener<
  OrderCreatedEvent,
  IOrderCreated
> {
  public readonly subject = Subjects.OrderCreated;
  public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: IOrderCreated, msg: Message) {
    msg.ack();
  }
}
