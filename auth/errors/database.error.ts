import { CustomError, IError } from ".";

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;
  constructor() {
    super("Error when connecting to database !");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  public serializeErrors(): IError[] {
    return [{ message: "Can't connect to datbase. Plz retry again !" }];
  }
}
