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

import orderRouter from "./router";
import { errorHandler } from "@dnt-ticketing-mvc/common";
import { DatabaseConnectionError } from "@dnt-ticketing-mvc/common";
import { natsInstance } from "./nats-wrapper";
import { ENV } from "./env";
import { TicketUpdatedListener, TicketCreatedListener } from "./events";

export default class ServerSetup {
  private app!: express.Express;
  private server!: http.Server;
  private readonly prefix: string = "/api";

  constructor(public readonly PORT: number) {
    this.init();
  }

  public start(): void {
    this.server = this.app.listen(this.PORT, () =>
      console.log(`Orders Service listening on port: 3000 ! 🚀🚀🚀`)
    );
    process.on("SIGTERM", this._handleGracefulShutdown);
    process.on("SIGTTIN", this._handleGracefulShutdown);
  }

  private init(): void {
    this.app = express();
    this.app.use(json());
    this.app.use(
      cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test",
      })
    );
    this._connectDatabase();
    this._connectNats();
    this._setupRouting();
    this.app.use(errorHandler);
  }

  public _setupRouting(): void {
    this.app.use(this.prefix + "/orders", orderRouter.getInstance().router);
  }

  private async _connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(ENV.MONGODB_URL!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
      });
      console.log("Orders Service - Connected to MongoDB successfully 🤘🤘🤘");
    } catch (error) {
      console.log(error);
      throw new DatabaseConnectionError(
        "Orders Service - Error while connecting to database !"
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

      new TicketCreatedListener(natsInstance.client).listen();
      new TicketUpdatedListener(natsInstance.client).listen();
    } catch (error) {
      console.error(error);
    }
  }

  private _handleGracefulShutdown = (): void => {
    this.server.close(() => {
      console.log("Graceful shutting down - Ticket services");
      mongoose.connections.forEach((connection) =>
        connection.close(false, () => {
          console.log("MongoDB connection closed - Ticket services");
          process.exit(0);
        })
      );
    });
  };
}
