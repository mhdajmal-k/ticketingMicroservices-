import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-pulisher";

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});
console.clear();
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "1334",
      title: "filim",
      price: 2000,
    });
  } catch (err) {
    console.log(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // stan.publish("ticket:created", data, () => {
  //   console.log("Event published ");
  // });
});
