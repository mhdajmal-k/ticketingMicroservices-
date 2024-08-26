import { Subject } from "./subject";

export interface TicketUpdatedEvent {
  subject: Subject.TicketUpdated;
  data: {
    id: string;
    title: string;
    // version: any;
    price: number;
    userId: string;
    orderId?: any;
  };
}
