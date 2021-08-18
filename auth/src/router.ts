import express from "express";
import { body, param } from "express-validator";
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
      "/currentUser/:email",
      [param("email").isEmail().notEmpty()],
      (request: express.Request, response: express.Response) =>
        AuthService.getInstance().currentUser(request, response)
    );
    this.router.post(
      "/signIn",
      [body("email").isEmail(), body("password").isLength({ min: 6, max: 32 })],
      (request: express.Request, response: express.Response) =>
        AuthService.getInstance().signIn(request, response)
    );
    this.router.post(
      "/signup",
      [
        body("email")
          .isEmail()
          .withMessage("Email is invalid")
          .trim()
          .notEmpty(),
        body("password").isLength({ min: 6, max: 32 }).trim().notEmpty(),
      ],
      (request: express.Request, response: express.Response) =>
        AuthService.getInstance().signUp(request, response)
    );
  }
}
