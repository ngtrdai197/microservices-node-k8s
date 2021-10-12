import {
  IOrderPaidSucceed,
  OrderPaidSucceedEvent,
  Publisher,
  Subjects,
} from "@dnt-ticketing-mvc/common";

export class OrderPaidSucceedPublisherEvent extends Publisher<
  OrderPaidSucceedEvent,
  IOrderPaidSucceed
> {
  public readonly subject = Subjects.OrderPaidSucceed;
}
