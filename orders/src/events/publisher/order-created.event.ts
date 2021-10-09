import {
  IOrderCreated,
  Subjects,
  OrderCreatedEvent,
  Publisher,
} from "@dnt-ticketing-mvc/common";

export class OrderCreatedPublisher extends Publisher<
  OrderCreatedEvent,
  IOrderCreated
> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
