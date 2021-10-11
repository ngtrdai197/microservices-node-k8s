import { IRouter, Request, Response, Router } from "express";
import orderService from "./services/order.service";
import { body, param } from "express-validator";
import {
  validateRequestHandler,
  authGuardMiddleware,
} from "@dnt-ticketing-mvc/common";

export default class OrderRouter {
  private static instance: OrderRouter;
  public readonly router: IRouter = Router();

  constructor() {
    this.initRouter();
  }

  public static getInstance(): OrderRouter {
    if (!OrderRouter.instance) {
      OrderRouter.instance = new OrderRouter();
    }
    return OrderRouter.instance;
  }

  private initRouter(): void {
    this.router.post(
      "/",
      [authGuardMiddleware],
      [
        body("ticketId")
          .isString()
          .notEmpty()
          .withMessage("Ticket Id must be supplied"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        orderService.createOrder(request, response)
    );
    this.router.put(
      "/:orderId",
      [authGuardMiddleware],
      [
        param("orderId")
          .isMongoId()
          .withMessage("Params of order ID is invalid"),
        body("status")
          .isString()
          .notEmpty()
          .withMessage("You must supply a status"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        orderService.editOrder(request, response)
    );
    this.router.delete(
      "/:orderId",
      [authGuardMiddleware],
      [
        param("orderId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        orderService.deleteOrder(request, response)
    );
    this.router.get(
      "/",
      [authGuardMiddleware],
      (request: Request, response: Response) =>
        orderService.getOrders(request, response)
    );
    this.router.get(
      "/:orderId",
      [authGuardMiddleware],
      [
        param("orderId")
          .isMongoId()
          .withMessage("Params of order ID is invalid"),
      ],
      (request: Request, response: Response) =>
        orderService.getOrderById(request, response)
    );
    this.router.get(
      "/ticket/:ticketId",
      [authGuardMiddleware],
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
      ],
      (request: Request, response: Response) =>
        orderService.getTicketById(request, response)
    );
  }
}
