import { IRouter, Request, Response, Router } from "express";
import ticketService from "./services/ticket.service";
import { body, param } from "express-validator";
import {
  validateRequestHandler,
  authGuardMiddleware,
} from "@dnt-ticketing-mvc/common";

export default class TicketRouter {
  public readonly router: IRouter = Router();
  private static instance: TicketRouter;
  constructor() {
    this.initRouter();
  }

  public static getInstance(): TicketRouter {
    if (!TicketRouter.instance) {
      TicketRouter.instance = new TicketRouter();
    }
    return TicketRouter.instance;
  }

  private initRouter(): void {
    this.router.post(
      "/",
      [authGuardMiddleware],
      [
        body("title")
          .isString()
          .notEmpty()
          .withMessage("You must supply a title")
          .isLength({ min: 6 })
          .withMessage("Length of title is invalid"),
        body("price").isFloat().withMessage("Price must be a number"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        ticketService.createTicket(request, response)
    );
    this.router.put(
      "/:ticketId",
      [authGuardMiddleware],
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
        body("title")
          .isString()
          .optional()
          .withMessage("You must supply a title")
          .isLength({ min: 6 })
          .withMessage("Length of title is invalid"),
        body("price")
          .optional()
          .isFloat()
          .withMessage("Price must be a number"),
        body("numberOfSeat")
          .optional()
          .isInt({ min: 0 })
          .withMessage("Number of seat must be a number"),
        body("isLocked")
          .optional()
          .isBoolean()
          .withMessage("isLocked must be a boolean value"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        ticketService.editTicket(request, response)
    );
    this.router.delete(
      "/:ticketId",
      [authGuardMiddleware],
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
      ],
      [validateRequestHandler],
      (request: Request, response: Response) =>
        ticketService.deleteTicket(request, response)
    );
    this.router.get(
      "/",
      [authGuardMiddleware],
      (request: Request, response: Response) =>
        ticketService.getTickets(request, response)
    );
    this.router.get(
      "/:ticketId",
      [authGuardMiddleware],
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
      ],
      (request: Request, response: Response) =>
        ticketService.getTicketById(request, response)
    );
  }
}
