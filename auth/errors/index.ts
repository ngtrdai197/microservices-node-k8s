import { ValidationError } from "express-validator";

export interface IError {
  message: string;
  field?: string;
}

interface ICustomError {
  statusCode: number;
  serializeErrors(): IError[];
}

export abstract class CustomError extends Error implements ICustomError {
  public abstract statusCode: number;
  public abstract serializeErrors(): IError[];

  constructor(protected readonly msg: string) {
    super(msg);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
