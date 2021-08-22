import { IRouter, Request, Response, Router } from "express";
import { TicketService } from "./services/ticket.service";

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
    this.router.post("/", (request: Request, response: Response) =>
      TicketService.getInstance().createTicket(request, response)
    );
    this.router.put("/", (request: Request, response: Response) =>
      TicketService.getInstance().editTicket(request, response)
    );
    this.router.get("/", (request: Request, response: Response) =>
      TicketService.getInstance().getTickets(request, response)
    );
    this.router.get("/:ticketId", (request: Request, response: Response) =>
      TicketService.getInstance().getTicketById(request, response)
    );
  }
}
