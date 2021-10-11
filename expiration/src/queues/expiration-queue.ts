import Queue from "bull";
import { ExpirationCompletePublisherEvent } from "../events/publisher/expiration-complete-publisher.event";
import { ENV } from "../env";
import { natsInstance } from "../nats-wrapper";

interface IPayload {
    orderId: string;
}

const EXPIRATION_QUEUE = "order:expiration";

const expirationQueue = new Queue<IPayload>(EXPIRATION_QUEUE, {
    redis: {
        host: ENV.REDIS_HOST,
    },
});

expirationQueue.process(async (job) => {
    console.log(
        `Handling an expiration:complete event for orderId: ${job.data.orderId} and jobId: ${job.id}`,
    );
    await new ExpirationCompletePublisherEvent(natsInstance.client).publish({
        orderId: job.data.orderId,
    });
});

export default expirationQueue;
