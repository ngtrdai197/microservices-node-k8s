import { Request } from "express";

export interface IUserPayload {
  id: string;
  email: string;
}

export interface IRequest extends Request {
  user?: IUserPayload;
}
