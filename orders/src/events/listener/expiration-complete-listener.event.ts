import {
  ExpirationCompleteEvent,
  IExpirationComplete,
  Listener,
  NotFoundError,
  ORDER_STATUS,
  QUEUE_GROUP_NAME,
  Subjects,
} from "@dnt-ticketing-mvc/common";
import { ITicketDoc } from "../../interfaces/ticket.interface";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../models/order.model";
import { OrderUpdatedPublisher } from "../publisher/order-updated-publisher.event";

export class ExpirationCompleteListenerEvent extends Listener<
  ExpirationCompleteEvent,
  IExpirationComplete
> {
  public queueGroupName: QUEUE_GROUP_NAME = QUEUE_GROUP_NAME.GROUP_ORDERS;
  public subject: Subjects = Subjects.ExpirationComplete;

  public async onMessage(
    data: IExpirationComplete,
    msg: Message
  ): Promise<void> {
    const order = await orderModel
      .findById(data.orderId)
      .populate(["ticket"])
      .exec();
    if (!order) {
      msg.ack();
      throw new NotFoundError("Order does not exist.");
    }

    if (order.status === ORDER_STATUS.COMPLETE) {
      return msg.ack();
    }
    await order.set({ status: ORDER_STATUS.CANCELLED }).save();
    const ticket = order.ticket as ITicketDoc;
    await new OrderUpdatedPublisher(this.client).publish({
      expiresAt: order.expiresAt,
      id: order.id,
      status: order.status,
      ticket: { id: ticket.id, price: ticket.price },
      userId: order.userId,
      version: order.version,
    });
    msg.ack();
  }
}
