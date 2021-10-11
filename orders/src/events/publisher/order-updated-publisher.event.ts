import {
  Subjects,
  Publisher,
  OrderUpdatedEvent,
  IOrderUpdated,
} from "@dnt-ticketing-mvc/common";

export class OrderUpdatedPublisher extends Publisher<
  OrderUpdatedEvent,
  IOrderUpdated
> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}
