import {
  ITicketUpdated,
  Subjects,
  TicketUpdatedEvent,
  Publisher,
} from "@dnt-ticketing-mvc/common";

export class TicketUpdatedPublisher extends Publisher<
  TicketUpdatedEvent,
  ITicketUpdated
> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
