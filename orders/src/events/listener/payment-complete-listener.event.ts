import {
  Listener,
  PaymentCompleteEvent,
  QUEUE_GROUP_NAME,
  Subjects,
  IPaymentComplete,
  NotFoundError,
  ORDER_STATUS,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../models/order.model";
import { OrderUpdatedPublisher } from "../publisher/order-updated-publisher.event";
import { ITicketDoc } from "../../interfaces/ticket.interface";
import { OrderPaidSucceedPublisherEvent } from "../publisher/order-paid-succeed-publisher.event";

export class PaymentCompleteListenerEvent extends Listener<
  PaymentCompleteEvent,
  IPaymentComplete
> {
  public readonly subject = Subjects.PaymentComplete;
  public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_ORDERS;

  public async onMessage(data: IPaymentComplete, msg: Message) {
    const order = await orderModel
      .findById(data.orderId)
      .populate(["ticket"])
      .exec();
    if (!order) {
      msg.ack();
      throw new NotFoundError("Order does not exist");
    }
    await order.set({ status: ORDER_STATUS.COMPLETE }).save();
    const ticket = order.ticket as ITicketDoc;
    Promise.all([
      new OrderUpdatedPublisher(this.client).publish({
        expiresAt: order.expiresAt,
        id: order.id,
        status: order.status,
        ticket: { id: ticket.id, price: ticket.price },
        userId: order.userId,
        version: order.version,
      }),
      new OrderPaidSucceedPublisherEvent(this.client).publish({
        orderId: order.id,
      }),
    ]);

    msg.ack();
  }
}
