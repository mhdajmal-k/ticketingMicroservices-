import { Subject } from "./subject";

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: {
    id: string;
    title: string;
    // version: number;
    price: number;
  };
}
