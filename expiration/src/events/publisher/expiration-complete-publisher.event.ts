import {
    ExpirationCompleteEvent,
    IExpirationComplete,
    Publisher,
    Subjects,
} from "@dnt-ticketing-mvc/common";

export class ExpirationCompletePublisherEvent extends Publisher<
    ExpirationCompleteEvent,
    IExpirationComplete
> {
    subject: Subjects = Subjects.ExpirationComplete;
}
