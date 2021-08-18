import express from "express";
import "express-async-errors";
/**
 * If not have this lib, whenever routes are asynchronous we cannot catch error, and maybe response will run infinity,
 * Or we can wrap throw Error inside next: express.NextFunction instead using libs
 */
import { json } from "body-parser";
import AuthRouter from "./router";
import { errorHandler } from "../middlewares/error-handler";

export default class ServerSetup {
  private app!: express.Express;
  private readonly prefix: string = "/api";

  constructor(public readonly PORT: number) {
    this.init();
  }

  private init(): void {
    this.app = express();
    this.app.use(json());
    this.setupRouting();
    this.app.use(errorHandler);
  }

  public setupRouting(): void {
    this.app.use(this.prefix + "/users", AuthRouter.getInstance().router);
  }

  public start(): void {
    this.app.listen(this.PORT, () =>
      console.log(`Auth Service listening on port: 3000 ! 🚀🚀🚀`)
    );
  }
}
