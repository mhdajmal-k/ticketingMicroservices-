import express, { Response, Request } from "express";

import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { createTicketRouter } from "./routers/createTicket";
import { viewTicketRouter } from "./routers/viewTicket";
import { listTickets } from "./routers/viewAllTicket";
import { updateTicketRouter } from "./routers/updateTicket";
import { natsWrapper } from "./nats.wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listner";
import { OrderCancelledListener } from "./events/listeners/ordere-cancelled-listener";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(createTicketRouter);
app.use(viewTicketRouter);
app.use(listTickets);
app.use(updateTicketRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("not fount");
});
// app.use(errorHandler);

const Connect = async () => {
  try {
    await natsWrapper.connect(
      "ticketing",
      "ticketClientId",
      "http://nats-srv:4222"
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets");
    console.log("ticketDB connected");
  } catch (err) {
    console.log(err);
  }
};
Connect();
app.listen(3001, () => {
  console.log("Ticket server is running on port 3001");
});
