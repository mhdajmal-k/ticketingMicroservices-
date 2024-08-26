import { Subject } from "./subject";

export interface TicketUpdatedEvent {
  subject: Subject.TicketUpdated;
  data: {
    id: string;
    title: string;
    // version: number;
    price: number;
    userId: string;
  };
}
