import express, { Request, Response } from "express";
import { currentUser } from "../../middilware/logined";
const router = express.Router();
import { Ticket } from "../model/ticket";
import { Order } from "../model/order";
import { OrderCreatePublisher } from "../event/publisher/order-created-publihser";
import { natsWrapper } from "../nats.wrapper";

router.post(
  "/api/orders/create",
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.status(401).json("Login Required");
    }

    const { ticketId } = req.body;
    if (!ticketId || ticketId.trim() === "") {
      return res.status(400).send("Ticket ID is required");
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json("Invalid ticket");
    }

    const existingOrder = await Order.findOne({
      ticket,
      status: {
        $in: ["created", "awaiting:payment", "completed"],
      },
    });

    if (existingOrder) {
      return res.status(400).send("Ticket already Reserved");
    }

    const expire = new Date();
    expire.setSeconds(expire.getSeconds() + 15 * 60);

    const order = new Order({
      userId: req.currentUser.id,
      status: "created",
      expireAt: expire,
      ticket: ticketId,
    });

    const timeFormat = order.expireAt?.toISOString();
    await order.save();

    new OrderCreatePublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: timeFormat,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
