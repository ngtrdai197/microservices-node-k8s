import { Request, Response } from "express";

export class TicketService {
  private static instance: TicketService;
  constructor() {}

  public static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  public async createTicket(req: Request, resp: Response) {
    console.log("req.body :>> ", req.body);
    return resp
      .status(201)
      .jsonp({ statusCode: 201, msg: "Create new ticket successfully" });
  }

  public async editTicket(req: Request, resp: Response) {
    console.log("req.body :>> ", req.body);
    return resp
      .status(200)
      .jsonp({ statusCode: 200, msg: "Edit ticket successfully" });
  }

  public async getTickets(req: Request, resp: Response) {
    return resp
      .status(200)
      .jsonp({ statusCode: 200, msg: "Get tickets successfully" });
  }

  public async getTicketById(req: Request, resp: Response) {
    console.log("req.params.ticketId :>> ", req.params.ticketId);
    return resp
      .status(200)
      .jsonp({ statusCode: 200, msg: "Get ticket by ID successfully" });
  }
}
