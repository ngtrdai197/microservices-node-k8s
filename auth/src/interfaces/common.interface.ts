import { Request } from "express";
import { IUserPayload } from "./user.interface";

export interface IRequest extends Request {
  user?: IUserPayload;
}
