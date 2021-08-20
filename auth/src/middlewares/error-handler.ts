import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .jsonp({ errors: err.serializeErrors(), statusCode: err.statusCode });
  }
  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong" }] })
    .end();
};
