// import { Publisher } from "./base-publisher";
import { Publisher } from "../base-publisher";
import { TicketCreatedEvent } from "../ticket-created.events";
import { Subject } from "../subject";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subject.TicketCreated = Subject.TicketCreated;
}
