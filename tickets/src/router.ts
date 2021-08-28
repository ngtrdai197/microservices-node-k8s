import { IRouter, Request, Response, Router } from "express";
import { TicketService } from "./services/ticket.service";
import { body, param } from "express-validator";
import { validateRequestHandler } from "@dnt-ticketing-mvc/shared";

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
        TicketService.getInstance().createTicket(request, response)
    );
    this.router.put(
      "/:ticketId",
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
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
        TicketService.getInstance().editTicket(request, response)
    );
    this.router.get("/", (request: Request, response: Response) =>
      TicketService.getInstance().getTickets(request, response)
    );
    this.router.get(
      "/:ticketId",
      [
        param("ticketId")
          .isMongoId()
          .withMessage("Params of ticket ID is invalid"),
      ],
      (request: Request, response: Response) =>
        TicketService.getInstance().getTicketById(request, response)
    );
  }
}
