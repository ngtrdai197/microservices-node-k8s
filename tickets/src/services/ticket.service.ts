import { NotFoundError, parseObjectID } from "@dnt-ticketing-mvc/common";
import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.interface";
import { ticketModel } from "../models/ticket.model";

export class TicketService {
  private static instance: TicketService;
  constructor() {}

  public static getInstance(): TicketService {
    if (!TicketService.instance) {
      TicketService.instance = new TicketService();
    }
    return TicketService.instance;
  }

  public async createTicket(req: IRequest, resp: Response) {
    const ticket = await ticketModel
      .build({
        userId: req.user!.id,
        title: "Summer Party",
        price: 50,
      })
      .save();
    return resp.status(201).jsonp({ statusCode: 201, data: ticket });
  }

  public async editTicket(req: Request, resp: Response) {
    const ticketId = parseObjectID(req.params.ticketId);

    const ticket = await ticketModel.findByIdAndUpdate(ticketId, req.body);
    if (!ticket) {
      throw new NotFoundError(`Cannot found ticket with ID: ${ticketId}`);
    }
    return resp.status(200).jsonp({
      statusCode: 200,
      data: ticket,
    });
  }

  public async getTickets(_: Request, resp: Response) {
    const tickets = await ticketModel.find({});
    return resp.status(200).jsonp({ statusCode: 200, data: tickets });
  }

  public async getTicketById(req: Request, resp: Response) {
    const ticketId = parseObjectID(req.params.ticketId);
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(`Cannot found ticket with ID: ${ticketId}`);
    }
    return resp.status(200).jsonp({ statusCode: 200, data: ticket });
  }
}
