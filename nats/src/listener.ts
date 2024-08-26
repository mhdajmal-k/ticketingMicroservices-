import nats, { Message, Stan } from "node-nats-streaming";
import { json } from "stream/consumers";
import { randomBytes } from "crypto";
import { TicketCreateListener } from "./events/ticket-creted-listner";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

console.clear();
stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  // const option = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true) //if lost data while to set db default
  //   .setDeliverAllAvailable()
  //   .setDurableName("accounting-service");

  // const subscription = stan.subscribe(
  //   "ticket:created",
  //   // "order-service-queue-group",
  //   "queue-group-name", //wipe out all the history when offline
  //   option
  // );
  // subscription.on("message", (msg: Message) => {
  //   console.log("Message recived");
  //   const data = msg.getData();
  //   if (typeof data == "string") {
  //     console.log(`Received event #${msg.getSequence()},with data : ${data}`);
  //   }
  //   msg.ack(); //to message acknowledge
  // });
  new TicketCreateListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

// abstract class Listener {
//   abstract subject: string;
//   abstract queueGroupName: string;
//   abstract onMessage(data: any, msg: Message): void;
//   private client: Stan;
//   protected ackWait = 5 * 10000;

//   constructor(client: Stan) {
//     this.client = client;
//   }
//   subscriptionOptions() {
//     return this.client
//       .subscriptionOptions()
//       .setDeliverAllAvailable()
//       .setManualAckMode(true)
//       .setAckWait(this.ackWait)
//       .setDurableName(this.queueGroupName);
//   }
//   listen() {
//     const subscription = this.client.subscribe(
//       this.subject,
//       this.queueGroupName,
//       this.subscriptionOptions()
//     );
//     subscription.on("message", (msg: Message) => {
//       console.log(`message received: ${this.subject}/ ${this.queueGroupName}`);
//       const parseData = this.parseMessage(msg);
//       this.onMessage(parseData, msg);
//     });
//   }

//   parseMessage(msg: Message) {
//     const data = msg.getData();
//     return typeof data === "string"
//       ? JSON.parse(data)
//       : JSON.parse(data.toString("utf-8"));
//   }
// }

// class TicketCreateListener extends Listener {
//   subject = "ticket:created";
//   queueGroupName = "payment-service";
//   onMessage(data: any, msg: Message) {
//     console.log("Event data!", data);
//     msg.ack();
//   }
// }
