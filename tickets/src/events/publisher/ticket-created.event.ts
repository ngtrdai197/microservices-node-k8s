import {
  ITicketCreated,
  Subjects,
  TicketCreatedEvent,
  Publisher,
} from "@dnt-ticketing-mvc/common";

export class TicketCreatedPublisher extends Publisher<
  TicketCreatedEvent,
  ITicketCreated
> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
