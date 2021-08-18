import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../../errors/request-validation.error";

export class AuthService {
  private static instance: AuthService;
  constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signIn(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    return res.status(200).json({ msg: "Sign in" }).end();
  }
}
