import express from "express";
import "express-async-errors";
/**
 * If not have this lib, whenever routes are asynchronous we cannot catch error, and maybe response will run infinity,
 * Or we can wrap throw Error inside next: express.NextFunction instead using libs
 */
import { json } from "body-parser";
import mongoose from "mongoose";
import * as http from "http";

import AuthRouter from "./router";
import { errorHandler } from "@dnt-ticketing-mvc/shared";
import { DatabaseConnectionError } from "@dnt-ticketing-mvc/shared";

export default class ServerSetup {
  private app!: express.Express;
  private server!: http.Server;
  private readonly prefix: string = "/api";

  constructor(public readonly PORT: number) {
    this.init();
  }

  private init(): void {
    this.app = express();
    this.app.use(json());
    this.connectDatabase();
    this.setupRouting();
    this.app.use(errorHandler);
  }

  public setupRouting(): void {
    this.app.use(this.prefix + "/users", AuthRouter.getInstance().router);
  }

  protected async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(
        "mongodb://auth-mongo-clusterip-srv:27017/mcsv-ticketing-auth",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: true,
        }
      );
      console.log("Auth Service - Connected to MongoDB successfully 🤘🤘🤘");
    } catch (error) {
      console.log(error);
      throw new DatabaseConnectionError(
        "Auth Service - Error while connecting to database !"
      );
    }
  }

  public start(): void {
    this.server = this.app.listen(this.PORT, () =>
      console.log(`Auth Service listening on port: 3000 ! 🚀🚀🚀`)
    );
    process.on("SIGTERM", this._handleGracefulShutdown);
    process.on("SIGTTIN", this._handleGracefulShutdown);
  }

  private _handleGracefulShutdown = (): void => {
    this.server.close(() => {
      console.log("Graceful shutting down - Auth services 🎉");
      mongoose.connections.forEach((connection) =>
        connection.close(false, () => {
          console.log("MongoDB connection closed - Auth services ");
          process.exit(0);
        })
      );
    });
  };
}
