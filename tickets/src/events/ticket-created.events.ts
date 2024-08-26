import { Subject } from "./subject";

export interface TicketCreatedEvent {
  subject: Subject.TicketCreated;
  data: {
    id: any;
    title: string;
    // version: number;
    price: number;
    userId: string;
  };
}
