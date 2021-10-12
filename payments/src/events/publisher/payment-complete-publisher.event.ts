import {
    IPaymentComplete,
    PaymentCompleteEvent,
    Publisher,
    Subjects,
} from "@dnt-ticketing-mvc/common";

export class PaymentCompletePublisherEvent extends Publisher<
    PaymentCompleteEvent,
    IPaymentComplete
> {
    public readonly subject = Subjects.PaymentComplete;
}
