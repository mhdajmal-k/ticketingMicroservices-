import { Message } from "node-nats-streaming";
import { Subject } from "./subject";
import { Listener } from "../base-listener";
import { TicketUpdatedEvent } from "./ticket-updated-event";
import { Ticket } from "../../model/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
  queueGroupName = "order-service";
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      // version: data.version - 1,
    });
    if (!ticket) {
      throw new Error("Ticket ot found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
