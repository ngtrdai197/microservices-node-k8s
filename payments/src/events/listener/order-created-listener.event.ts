import {IOrderCreated, Listener, OrderCreatedEvent, QUEUE_GROUP_NAME, Subjects} from "@dnt-ticketing-mvc/common";
import {Message} from "node-nats-streaming";
import {orderModel} from "../../models/order.model";


export class OrderCreatedListenerEvent extends Listener<OrderCreatedEvent, IOrderCreated> {
    public readonly queueGroupName: QUEUE_GROUP_NAME = QUEUE_GROUP_NAME.GROUP_PAYMENTS;
    public readonly subject = Subjects.OrderCreated;

    public async onMessage(data: IOrderCreated, msg: Message): Promise<void> {
        const order = orderModel.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })
        await order.save()

        msg.ack()
    }

}
