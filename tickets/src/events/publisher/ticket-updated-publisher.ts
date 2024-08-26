// import { Publisher } from "./base-publisher";
import { Publisher } from "../base-publisher";
import { TicketUpdatedEvent } from "../ticket-updated-event";
import { Subject } from "../subject";

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subject.TicketUpdated = Subject.TicketUpdated;
}
