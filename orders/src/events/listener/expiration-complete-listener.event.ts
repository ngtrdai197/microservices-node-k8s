import {
  ExpirationCompleteEvent,
  IExpirationComplete,
  Listener,
  NotFoundError,
  ORDER_STATUS,
  QUEUE_GROUP_NAME,
  Subjects,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../models/order.model";

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
    const order = await orderModel.findById(data.orderId).exec();
    if (!order) {
      msg.ack();
      throw new NotFoundError("Order does not exist.");
    }
    if (
      [ORDER_STATUS.CREATED, ORDER_STATUS.AWAITING_PAYMENT].includes(
        order.status
      )
    ) {
      await order.set({ status: ORDER_STATUS.CANCELLED }).save();
    }
    msg.ack();
  }
}
