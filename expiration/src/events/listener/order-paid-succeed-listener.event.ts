import {
    Listener,
    IOrderPaidSucceed,
    OrderPaidSucceedEvent,
    QUEUE_GROUP_NAME,
    Subjects,
} from "@dnt-ticketing-mvc/common";
import { Message } from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";
import { jobNameExpirationOrderBuilder } from "../../build-job-name";

export class OrderPaidSucceedListenerEvent extends Listener<
    OrderPaidSucceedEvent,
    IOrderPaidSucceed
> {
    public subject: Subjects.OrderPaidSucceed = Subjects.OrderPaidSucceed;
    public queueGroupName: QUEUE_GROUP_NAME = QUEUE_GROUP_NAME.GROUP_EXPIRATION;

    public async onMessage(
        data: IOrderPaidSucceed,
        msg: Message,
    ): Promise<void> {
        try {
            const job = await expirationQueue.getJob(
                jobNameExpirationOrderBuilder(data.orderId),
            );
            if (job) {
                await job.remove();
                console.log(
                    `JobId: ${jobNameExpirationOrderBuilder(
                        data.orderId,
                    )} already removed from QUEUE: ${
                        QUEUE_GROUP_NAME.GROUP_EXPIRATION
                    } with subject: ${Subjects.OrderPaidSucceed}`,
                );
            }
        } catch (e) {
            console.log(e);
        } finally {
            msg.ack();
        }
    }
}
