import { Subjects } from "./subject";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: string;
    userId: string;
    // version?: any;
    expiresAt: string | any;
    ticket: {
      id: string;
      price: number;
    };
  };
}
