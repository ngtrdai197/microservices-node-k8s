import {Message} from "node-nats-streaming";
import {
    QUEUE_GROUP_NAME,
    Subjects,
    Listener,
    OrderCancelledEvent,
    IOrderCreated,
    NotFoundError,
    IOrderCancelled,
} from "@dnt-ticketing-mvc/common";
import {ticketModel} from "../../models/ticket.model";
import {TicketUpdatedPublisher} from "../publisher/ticket-updated.event";

export class OrderCancelledListener extends Listener<OrderCancelledEvent,
    IOrderCancelled> {
    public readonly subject = Subjects.OrderCancelled;
    public readonly queueGroupName = QUEUE_GROUP_NAME.GROUP_TICKETS;

    public async onMessage(data: IOrderCreated, msg: Message) {
        const ticket = await ticketModel.findById(data.ticket.id);
        if (!ticket) {
            throw new NotFoundError(
                "Can not found ticket with ID: " + data.ticket.id
            );
        }
        await ticket.set({orderId: undefined}).save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            version: ticket.version,
            numberOfSeat: ticket.numberOfSeat,
            isLocked: ticket.isLocked,
        });
        msg.ack();
    }
}
