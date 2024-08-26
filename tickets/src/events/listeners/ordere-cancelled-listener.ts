import { Message } from "node-nats-streaming";
import { Listener } from "../base-listener";
import { Ticket } from "../../model/ticketmodel";
import { TicketUpdatePublisher } from "../publisher/ticket-updated-publisher";
import { natsWrapper } from "../../nats.wrapper";

import { OrderCancelledEvent } from "./order-cancelled-evnets";
import { Subjects } from "./subject";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = "ticket-service";
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("ticket not found");
    }
    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatePublisher(natsWrapper.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.userId,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });
    msg.ack();
  }
}
