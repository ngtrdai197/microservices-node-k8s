import { CustomError, IError } from ".";

export class UnAuthorizationError extends CustomError {
  public statusCode: number = 401;
  constructor(public msg: string = "Unauthorized") {
    super(msg);
    Object.setPrototypeOf(this, UnAuthorizationError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: this.msg }];
  }
}
