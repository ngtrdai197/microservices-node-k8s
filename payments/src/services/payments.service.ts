import { Response } from "express";
import { IRequest } from "../interfaces/common.interface";
import { orderModel } from "../models/order.model";
import {
    BadRequestError,
    NotFoundError,
    ORDER_STATUS,
} from "@dnt-ticketing-mvc/common";

class PaymentsService {
    private static instance: PaymentsService;

    constructor() {}

    public static getInstance(): PaymentsService {
        if (!PaymentsService.instance) {
            PaymentsService.instance = new PaymentsService();
        }
        return PaymentsService.instance;
    }

    public async createOrder(req: IRequest, resp: Response) {
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId).exec();
        if (!order) {
            throw new NotFoundError("Order does not exist");
        }
        switch (order.status) {
            case ORDER_STATUS.COMPLETE:
                throw new BadRequestError("Order is completed");
            case ORDER_STATUS.CANCELLED:
                throw new BadRequestError("Order is cancelled");
            default:
        }
        // TODO: do something with payment
        return resp.status(201).jsonp({
            statusCode: 201,
            data: "Let's do payment for this order",
        });
    }
}

const paymentsService = PaymentsService.getInstance();
export default paymentsService;
