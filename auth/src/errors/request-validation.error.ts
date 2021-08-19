import { ValidationError } from "express-validator";
import { CustomError, IError } from ".";

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors(): IError[] {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }));
  }
}
