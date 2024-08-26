import express, { Response, Request } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { natsWrapper } from "./nats.wrapper";
import { deleteOrderRouter } from "./routers/deleteOrder";
import { getOrderRouter } from "./routers/showOrder";
import { createOrderRouter } from "./routers/createOrder";
import { listOrderRouter } from "./routers/indexOrder";
import { TicketCreatedListener } from "./event/listener/ticket-created-listenere";
import { TicketUpdatedListener } from "./event/listener/ticket-updated-listener";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(createOrderRouter);
app.use(getOrderRouter);
app.use(listOrderRouter);
app.use(deleteOrderRouter);

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("not fount");
});
// app.use(errorHandler);

const Connect = async () => {
  try {
    await natsWrapper.connect(
      "ticketing",
      "ordersClientId",
      "http://nats-srv:4222"
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect("mongodb://orders-mongo-srv:27017/orders");
    console.log("orderDB connected");
  } catch (err) {
    console.log(err);
  }
};
Connect();
app.listen(3002, () => {
  console.log("order    server is running on port 3002");
});
