import { CustomError, IError } from ".";

export class ConflictRequestError extends CustomError {
  public statusCode: number = 409;
  constructor(public msg: string = "Conflict request") {
    super(msg);
    Object.setPrototypeOf(this, ConflictRequestError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: this.msg }];
  }
}
