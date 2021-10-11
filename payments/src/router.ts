import { IRouter, Request, Response, Router } from "express";
import paymentsService from "./services/payments.service";
import {
    validateRequestHandler,
    authGuardMiddleware,
} from "@dnt-ticketing-mvc/common";
import { body } from "express-validator";

export default class PaymentsRouter {
    private static instance: PaymentsRouter;
    public readonly router: IRouter = Router();

    constructor() {
        this.initRouter();
    }

    public static getInstance(): PaymentsRouter {
        if (!PaymentsRouter.instance) {
            PaymentsRouter.instance = new PaymentsRouter();
        }
        return PaymentsRouter.instance;
    }

    private initRouter(): void {
        this.router.post(
            "/",
            [authGuardMiddleware],
            [
                body("orderId")
                    .isString()
                    .notEmpty()
                    .withMessage("Order Id must be supplied"),
            ],
            [validateRequestHandler],
            (request: Request, response: Response) =>
                paymentsService.createOrder(request, response),
        );
    }
}
