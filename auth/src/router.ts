import { IRouter, Request, Response, Router } from "express";
import { body } from "express-validator";
import { IRequest } from "./interfaces/common.interface";
import { authGuardMiddleware } from "./middlewares/auth-guard.middleware";
import { validateRequestHandler } from "./middlewares/validate-request-handler";
import { AuthService } from "./services/auth.service";

export default class AuthRouter {
  public readonly router: IRouter = Router();
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
      "/currentuser",
      [authGuardMiddleware],
      (request: IRequest, response: Response) => {
        return response
          .status(200)
          .json({ data: request.user || null, statusCode: 200 });
      }
    );
    this.router.post(
      "/signin",
      [
        body("email")
          .isEmail()
          .withMessage("Email is invalid")
          .notEmpty()
          .withMessage("You must supply an email"),
        body("password")
          .notEmpty()
          .withMessage("You must supply a password")
          .isLength({ min: 6, max: 32 })
          .withMessage("Length of password is invalid"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
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
      [validateRequestHandler],
      (request: Request, response: Response) =>
        AuthService.getInstance().signUp(request, response)
    );
  }
}
