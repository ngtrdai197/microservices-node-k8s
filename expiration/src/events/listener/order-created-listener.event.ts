import {
    IOrderCreated,
    Listener,
    OrderCreatedEvent,
    QUEUE_GROUP_NAME,
    Subjects,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";
import { jobNameExpirationOrderBuilder } from "../../build-job-name";

export class OrderCreatedListenerEvent extends Listener<
    OrderCreatedEvent,
    IOrderCreated
> {
    public subject: Subjects.OrderCreated = Subjects.OrderCreated;
    public queueGroupName: QUEUE_GROUP_NAME = QUEUE_GROUP_NAME.GROUP_EXPIRATION;

    public async onMessage(data: IOrderCreated, msg: Message): Promise<void> {
        try {
            const currentTime = new Date().getTime();
            const expireAtTime = new Date(data.expiresAt).getTime();
            const delay = expireAtTime - currentTime;
            const minutes = Math.round(delay / 1000 / 60);
            console.log(
                `Queue will be delayed in ${minutes} ${
                    minutes > 1 ? "minutes" : "minute"
                } and after it will be process the job`,
            );
            expirationQueue.add(
                {
                    orderId: data.id,
                },
                {
                    jobId: jobNameExpirationOrderBuilder(data.id),
                    delay,
                    removeOnComplete: true,
                    removeOnFail: true,
                    attempts: 3,
                },
            );
        } catch (e) {
            console.log(e);
        } finally {
            msg.ack();
        }
    }
}
