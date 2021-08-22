import express from "express";
import "express-async-errors";
/**
 * If not have this lib, whenever routes are asynchronous we cannot catch error, and maybe response will run infinity,
 * Or we can wrap throw Error inside next: express.NextFunction instead using libs
 */
import { json } from "body-parser";
import mongoose from "mongoose";
import TicketRouter from "./router";
import { errorHandler } from "@dnt-ticketing-mvc/shared";
import { DatabaseConnectionError } from "@dnt-ticketing-mvc/shared";

export default class ServerSetup {
  private app!: express.Express;
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
    this.app.use(this.prefix + "/tickets", TicketRouter.getInstance().router);
  }

  protected async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(
        "mongodb://tickets-mongo-clusterip-srv:27017/mcsv-ticketing-tickets",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: true,
        }
      );
      console.log("Tickets Service - Connected to MongoDB successfully 🤘🤘🤘");
    } catch (error) {
      console.log(error);
      throw new DatabaseConnectionError(
        "Tickets Service - Error while connecting to database !"
      );
    }
  }

  public start(): void {
    this.app.listen(this.PORT, () =>
      console.log(`Tickets Service listening on port: 3000 ! 🚀🚀🚀`)
    );
  }
}
