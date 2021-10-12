import {
    IOrderCreated,
    Listener,
    OrderCreatedEvent,
    QUEUE_GROUP_NAME,
    Subjects,
} from "@dnt-ticketing-mvc/common";
import {Message} from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";

export class OrderPaidSuccessfulListenerEvent extends Listener<OrderCreatedEvent,
    IOrderCreated> {
    public subject: Subjects.OrderCreated = Subjects.;
    public queueGroupName: QUEUE_GROUP_NAME = QUEUE_GROUP_NAME.GROUP_EXPIRATION;

    public async onMessage(data: IOrderCreated, msg: Message): Promise<void> {
        try {
            const currentTime = new Date().getTime();
            const expireAtTime = new Date(data.expiresAt).getTime();
            const delay = expireAtTime - currentTime;
            console.log(
                `Queue will be delayed in ${
                    delay / 1000 / 60
                } minutes and after it will be process the job`,
            );
            await expirationQueue.add(
                `Expiration-Order-${data.id}`,
                {
                    orderId: data.id,
                },
                {
                    delay,
                },
            );
        } catch (e) {
            console.log(e);
        } finally {
            msg.ack();
        }
    }
}
