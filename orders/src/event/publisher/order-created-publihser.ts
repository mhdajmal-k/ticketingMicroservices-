import { Publisher } from "../base-publisher";
import { OrderCreatedEvent } from "../order-created-events";
import { Subjects } from "../subject";

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
