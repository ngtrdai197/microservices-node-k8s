import { CustomError, IError } from ".";

export class NotFoundError extends CustomError {
  public statusCode: number = 404;
  constructor(public msg: string = "Not found") {
    super(msg);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: this.msg }];
  }
}
