import { Publisher } from "../base-publisher";
import { Subjects } from "../subject";
import { OrderCancelledEvent } from "../order-cancelled-evnets";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
