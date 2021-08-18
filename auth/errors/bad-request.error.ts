import { CustomError, IError } from ".";

export class BadRequestError extends CustomError {
  public statusCode: number = 400;
  constructor(public msg: string = "Bad request") {
    super(msg);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: this.msg }];
  }
}
