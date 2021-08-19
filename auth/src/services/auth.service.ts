import { Request, Response } from "express";
import { ConflictRequestError } from "../errors/conflict-request.error";
import { userModel } from "../models/user.model";
import * as jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request.error";
import { CryptoUtil } from "../utils/crypto.util";
import { IUserDoc, IUserPayload } from "../interfaces/user.interface";

export class AuthService {
  private static instance: AuthService;
  constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async getUserById(userId: string): Promise<IUserDoc | null> {
    return userModel.findById(userId);
  }

  public async signIn(req: Request, res: Response) {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      throw new BadRequestError("Credentials is incorrect !");
    }
    const isEqual = await CryptoUtil.compare(user.password, req.body.password);
    if (!isEqual) {
      throw new BadRequestError("Credentials is incorrect !");
    }
    console.log("process.env.JWT_SECRET_KEY :>> ", process.env.JWT_SECRET_KEY);
    const payload: IUserPayload = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
      expiresIn: "1h",
    });
    return res.status(200).json({ statusCode: 200, data: token }).end();
  }

  public async signUp(req: Request, res: Response) {
    const exist = await userModel.findOne({ email: req.body.email });
    if (exist) {
      throw new ConflictRequestError(
        "Email already exist. Plz use another email."
      );
    }
    const user = await userModel
      .build({
        email: req.body.email,
        password: req.body.password,
      })
      .save();
    return res.status(200).json({ data: user }).end();
  }
}
