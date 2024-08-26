import { Message } from "node-nats-streaming";
import { Listener } from "../base-listener";
import { OrderCreatedEvent } from "../listeners/order-created-events";
import { Subjects } from "./subject";
import { Ticket } from "../../model/ticketmodel";
import { TicketUpdatePublisher } from "../publisher/ticket-updated-publisher";
import { natsWrapper } from "../../nats.wrapper";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "ticket-service";
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("ticket not found");
    }
    ticket.set({ orderId: data.id });
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
