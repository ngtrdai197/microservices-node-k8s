import {
    IOrderCreated,
    IOrderUpdated,
    Listener,
    NotFoundError,
    ORDER_STATUS,
    OrderUpdatedEvent,
    QUEUE_GROUP_NAME,
    Subjects,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../models/order.model";

export class OrderUpdatedListenerEvent extends Listener<
    OrderUpdatedEvent,
    IOrderUpdated
> {
    public readonly queueGroupName: QUEUE_GROUP_NAME =
        QUEUE_GROUP_NAME.GROUP_PAYMENTS;
    public readonly subject = Subjects.OrderUpdated;

    public async onMessage(data: IOrderUpdated, msg: Message): Promise<void> {
        const order = await orderModel.findByEvent({
            id: data.id,
            version: data.version,
        });

        if (!order) {
            msg.ack();
            throw new NotFoundError("Order does not exist");
        }
        await order
            .set({
                price: data.ticket.price,
                userId: data.userId,
                status: data.status,
            })
            .save();
        msg.ack();
    }
}
