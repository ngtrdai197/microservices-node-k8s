import {
  NotAuthorizedError,
  NotFoundError,
  parseObjectID,
} from "@dnt-ticketing-mvc/common";
import { Request, Response } from "express";
import { IRequest } from "../interfaces/common.interface";
import { orderModel } from "../models/order.model";

class OrderService {
  private static instance: OrderService;
  constructor() {}

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async createOrder(req: IRequest, resp: Response) {
    const order = await orderModel
      .build({
        ...req.body,
        userId: req.currentUser!.id,
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
    const orderId = parseObjectID(req.params.orderId);
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundError(`Cannot found order with ID: ${orderId}`);
    }
    return resp.status(200).jsonp({ statusCode: 200, data: order });
  }
}

const orderService = OrderService.getInstance();
export default orderService;
