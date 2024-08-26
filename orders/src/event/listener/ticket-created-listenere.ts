import { Message } from "node-nats-streaming";
import { Listener } from "../base-listener";
import { TicketCreatedEvent } from "./ticket-created.events";
import { Subject } from "./subject";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
  queueGroupName = "order-service";
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = new Ticket({ _id: id, price, title });
    await ticket.save();
    msg.ack();
  }
}
