import { CustomError, IError } from ".";

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;
  constructor(public msg: string) {
    super(msg);
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: "Can't connect to database. Plz retry again !" }];
  }
}
