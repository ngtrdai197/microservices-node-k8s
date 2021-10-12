import { Response } from "express";
import { IRequest } from "../interfaces/common.interface";
import { orderModel } from "../models/order.model";
import {
    BadRequestError,
    NotAuthorizedError,
    NotFoundError,
    ORDER_STATUS,
} from "@dnt-ticketing-mvc/common";
import stripe from "../utils/stripe";
import { Stripe } from "stripe";
import { PaymentCompletePublisherEvent } from "../events/publisher/payment-complete-publisher.event";
import { natsInstance } from "../nats-wrapper";

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
        const { orderId, stripeToken } = req.body;
        const order = await orderModel.findById(orderId).exec();
        if (!order) {
            throw new NotFoundError("Order does not exist");
        }
        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError(
                "Current user not possible pay for this order",
            );
        }
        switch (order.status) {
            case ORDER_STATUS.COMPLETE:
                throw new BadRequestError("Cannot pay for an completed order");
            case ORDER_STATUS.CANCELLED:
                throw new BadRequestError("Cannot pay for an cancelled order");
            default:
        }
        // TODO: do something with payment
        try {
            await stripe.charges.create({
                amount: order.price * 100, // convert cents to dollar by multiply 100
                currency: "usd",
                source: stripeToken,
                description: "Payment for order: " + order.id,
                //customer: order.userId, // TODO: create customer collection to save customer from stripe later
            });
            new PaymentCompletePublisherEvent(natsInstance.client).publish({
                orderId: order.id,
            });
        } catch (e: any) {
            const error = e as Stripe.StripeInvalidRequestError;
            throw new BadRequestError((error.raw as any).message);
        }

        return resp.status(201).jsonp({
            statusCode: 201,
            data: "You already pay for this order successfully ",
        });
    }
}

const paymentsService = PaymentsService.getInstance();
export default paymentsService;
