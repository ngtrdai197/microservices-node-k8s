import {
  NotAuthorizedError,
  NotFoundError,
  parseObjectID,
} from "@dnt-ticketing-mvc/common";
import { Request, Response } from "express";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created.event";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated.event";
import { IRequest } from "../interfaces/common.interface";
import { ticketModel } from "../models/ticket.model";
import { natsInstance } from "../nats-wrapper";

class TicketService {
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
        ...req.body,
        userId: req.currentUser!.id,
      })
      .save();
    await new TicketCreatedPublisher(natsInstance.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });
    return resp.status(201).jsonp({ statusCode: 201, data: ticket });
  }

  public async editTicket(req: Request, resp: Response) {
    const ticket = await ticketModel.findById(req.params.ticketId);
    if (!ticket) {
      throw new NotFoundError(
        `Cannot found ticket with ID: ${req.params.ticketId}`
      );
    }
    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError("You do not have permission to do this");
    }
    await ticket
      .set({
        title: req.body.title,
        price: req.body.price,
      })
      .save();
    await new TicketUpdatedPublisher(natsInstance.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });
    return resp.status(200).jsonp({
      statusCode: 200,
      data: ticket,
    });
  }

  public async deleteTicket(req: Request, resp: Response) {
    const ticketId = req.params.ticketId;

    const ticket = await ticketModel.findById(ticketId).exec();
    if (!ticket) {
      throw new NotFoundError(`Cannot found ticket with ID: ${ticketId}`);
    }
    await ticket.deleteOne();
    return resp.status(200).jsonp({
      statusCode: 200,
      data: null,
      mesg: "Deleted ticket successfully",
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

const ticketService = TicketService.getInstance();
export default ticketService;
