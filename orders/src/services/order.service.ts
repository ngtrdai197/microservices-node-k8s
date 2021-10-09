import {
  NotAuthorizedError,
  NotFoundError,
  ConflictRequestError,
  ORDER_STATUS,
} from "@dnt-ticketing-mvc/common";
import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.interface";
import { orderModel } from "../models/order.model";
import { ticketModel } from "../models/ticket.model";

class OrderService {
  private static instance: OrderService;
  private readonly EXPIRATION_ORDER_BY_SECONDS = 15 * 60;
  constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async createOrder(req: IRequest, resp: Response) {
    const { ticketId } = req.body;
    const ticket = await ticketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError(
        `Can not found ticket with ticket id: ${ticketId}`
      );
    }
    const exist = await ticket.isReserved();
    if (exist) {
      throw new ConflictRequestError("Ticket is already reserved");
    }
    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + this.EXPIRATION_ORDER_BY_SECONDS
    );
    const order = await orderModel
      .build({
        ticket: ticketId,
        userId: req.currentUser!.id,
        expiresAt: expiration,
        status: ORDER_STATUS.CREATED,
      })
      .save();
    return resp.status(201).jsonp({ statusCode: 201, data: order });
  }

  public async editOrder(req: Request, resp: Response) {
    const order = await orderModel.findById(req.params.orderId);
    if (!order) {
      throw new NotFoundError(
        `Cannot found order with ID: ${req.params.orderId}`
      );
    }
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError("You do not have permission to do this");
    }
    await order
      .set({
        status: req.body.title,
      })
      .save();
    return resp.status(200).jsonp({
      statusCode: 200,
      data: order,
    });
  }

  public async deleteOrder(req: Request, resp: Response) {
    const orderId = req.params.orderId;

    const order = await orderModel.findById(orderId).exec();
    if (!order) {
      throw new NotFoundError(`Cannot found order with ID: ${orderId}`);
    }
    await order.deleteOne();
    return resp.status(200).jsonp({
      statusCode: 200,
      data: null,
      mesg: "Deleted order successfully",
    });
  }

  public async getOrders(_: Request, resp: Response) {
    const orders = await orderModel.find({});
    return resp.status(200).jsonp({ statusCode: 200, data: orders });
  }

  public async getOrderById(req: Request, resp: Response) {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId).populate(["ticket"]);
    if (!order) {
      throw new NotFoundError(`Cannot found order with ID: ${orderId}`);
    }
    console.log("order.ticket :>> ", order.ticket);
    return resp.status(200).jsonp({ statusCode: 200, data: order });
  }

  public async getTicketById(req: Request, resp: Response) {
    const ticket = await ticketModel.findById(req.params.ticketId);
    if (!ticket) {
      throw new NotFoundError(
        `Cannot found ticket with ID: ${req.params.ticketId}`
      );
    }
    return resp.status(200).jsonp({ statusCode: 200, data: ticket });
  }
}

const orderService = OrderService.getInstance();
export default orderService;
