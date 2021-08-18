import express from "express";
import { body } from "express-validator";
import { AuthService } from "./services/auth.service";

export default class AuthRouter {
  public readonly router: express.IRouter = express.Router();
  private static instance: AuthRouter;
  constructor() {
    this.initRouter();
  }

  public static getInstance(): AuthRouter {
    if (!AuthRouter.instance) {
      AuthRouter.instance = new AuthRouter();
    }
    return AuthRouter.instance;
  }

  private initRouter(): void {
    this.router.get(
      "/currentUser",
      (_: express.Request, response: express.Response) => {
        return response
          .status(200)
          .json({ name: "Dai Nguyen", email: "dainguyen.iammm@gmail.com" });
      }
    );
    this.router.post(
      "/signIn",
      [body("email").isEmail(), body("password").isLength({ min: 6, max: 32 })],
      (request: express.Request, response: express.Response) =>
        AuthService.getInstance().signIn(request, response)
    );
    this.router.get(
      "/signOut",
      (_: express.Request, response: express.Response) => {
        return response.status(200).json({ msg: "Sign out" });
      }
    );
  }
}
