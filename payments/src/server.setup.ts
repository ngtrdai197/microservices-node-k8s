import express from "express";
import "express-async-errors";
/**
 * If not have this lib, whenever routes are asynchronous we cannot catch error, and maybe response will run infinity,
 * Or we can wrap throw Error inside next: express.NextFunction instead using libs
 */
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import * as http from "http";

import PaymentsRouter from "./router";
import {
    DatabaseConnectionError,
    errorHandler,
} from "@dnt-ticketing-mvc/common";
import { Stan } from "node-nats-streaming";
import { natsInstance } from "./nats-wrapper";
import { ENV } from "./env";
import { OrderCreatedListenerEvent } from "./events/listener/order-created-listener.event";
import { OrderUpdatedListenerEvent } from "./events/listener/order-updated-listener.event";

export default class ServerSetup {
    private app!: express.Express;
    private server!: http.Server;
    private readonly prefix: string = "/api";

    constructor(public readonly PORT: number) {
        this.init();
    }

    private static _composeEventListener(client: Stan): void {
        new OrderCreatedListenerEvent(client).listen();
        new OrderUpdatedListenerEvent(client).listen();
    }

    public start(): void {
        this.server = this.app.listen(this.PORT, () =>
            console.log(
                `Payments Service listening on port: ${this.PORT} ! 🚀🚀🚀`,
            ),
        );
        process.on("SIGTERM", this._handleGracefulShutdown);
        process.on("SIGTTIN", this._handleGracefulShutdown);
    }

    public _setupRouting(): void {
        this.app.use(
            this.prefix + "/payments",
            PaymentsRouter.getInstance().router,
        );
    }

    private init(): void {
        this.app = express();
        this.app.use(json());
        this.app.use(
            cookieSession({
                signed: false,
                secure: process.env.NODE_ENV !== "test",
            }),
        );
        this._connectDatabase();
        this._connectNats();
        this._setupRouting();
        this.app.use(errorHandler);
    }

    private async _connectDatabase(): Promise<void> {
        try {
            await mongoose.connect(ENV.MONGODB_URL!, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: true,
            });
            console.log(
                "Payments Service - Connected to MongoDB successfully 🤘🤘🤘",
            );
        } catch (error) {
            console.log(error);
            throw new DatabaseConnectionError(
                "Payments Service - Error while connecting to database !",
            );
        }
    }

    private async _connectNats() {
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

    private _handleGracefulShutdown = (): void => {
        this.server.close(() => {
            console.log("Graceful shutting down - Payments services");
            mongoose.connections.forEach((connection) =>
                connection.close(false, () => {
                    console.log(
                        "MongoDB connection closed - Payments services",
                    );
                    process.exit(0);
                }),
            );
        });
    };
}
