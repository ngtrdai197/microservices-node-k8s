import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ConflictRequestError } from "../../errors/conflict-request.error";
import { NotFoundError } from "../../errors/not-found.error";
import { RequestValidationError } from "../../errors/request-validation.error";
import { User } from "../models/user.model";

export class AuthService {
  private static instance: AuthService;
  constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async currentUser(req: Request, res: Response) {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      throw new NotFoundError("User does not exist. Plz check again.");
    }
    return res.status(200).json({ data: user }).end();
  }

  public async signIn(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    return res.status(200).json({ msg: "Sign in" }).end();
  }

  public async signUp(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      throw new ConflictRequestError(
        "Email already exist. Plz use another email."
      );
    }
    const user = await User.build({
      email: req.body.email,
      password: req.body.password,
    }).save();
    return res.status(200).json({ data: user }).end();
  }
}
