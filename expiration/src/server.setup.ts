import {Stan} from "node-nats-streaming";
import {natsInstance} from "./nats-wrapper";
import {ENV} from "./env";
import {OrderCreatedListenerEvent} from "./events/listener/order-created-listener.event";

export default class ServerSetup {
    constructor() {
        this.init();
    }

    private static _composeEventListener(client: Stan): void {
        new OrderCreatedListenerEvent(client).listen()
    }

    private init(): void {
        this._connectNats();
    }

    private async _connectNats(): Promise<void> {
        try {
            await natsInstance.connect({
                clusterId: ENV.NATS_CLUSTER_ID!,
                clientId: ENV.NAST_CLIENT_ID!,
                url: ENV.NATS_URL!,
            });
            natsInstance.client.on("close", () => {
                console.log("NATS connection closed!");
                process.exit();
            });
            process.on("SIGINT", () => natsInstance.client.close());
            process.on("SIGTERM", () => natsInstance.client.close());
            // listener trigger event
            ServerSetup._composeEventListener(natsInstance.client);
        } catch (error) {
            console.error(error);
        }
    }
}
