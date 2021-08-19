import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { UnAuthorizationError } from "../errors/unauthorization.error";
import { IRequest } from "../interfaces/common.interface";
import { IUserPayload } from "../interfaces/user.interface";
import { AuthService } from "../services/auth.service";

export const authGuardMiddleware = async (
  req: IRequest,
  _: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    throw new UnAuthorizationError();
  }
  try {
    const token = authToken.split(" ")[1];
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY!
    )) as jwt.JwtPayload;
    const user = await AuthService.getInstance().getUserById(decoded.id);
    if (!user) {
      throw new UnAuthorizationError();
    }
    req.user = user as IUserPayload;
  } catch (error) {
    throw new UnAuthorizationError("Verify your token is failed.");
  }
  next();
};
