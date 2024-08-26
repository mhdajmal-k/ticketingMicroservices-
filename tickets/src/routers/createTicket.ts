import express, { Request, Response } from "express";
import { currentUser } from "../../middilware/logined";
import { Ticket } from "../model/ticketmodel";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-pulisher";
import { natsWrapper } from "../nats.wrapper";

const router = express.Router();

router.post(
  "/api/tickets/create",
  currentUser,
  async (req: Request, res: Response) => {
    console.log("create server");

    if (!req.currentUser) {
      return res.status(401).json("Authentication required");
    }

    const { title, price } = req.body;
    console.log(req.body);
    console.log(title, "it is the title");
    console.log(price, "it is the price");

    if (!title || title.trim() === "" || !price || price <= 0) {
      return res
        .status(400)
        .json("Title and price are required and price must be positive");
    }

    try {
      const ticket = new Ticket({ title, price, userId: req.currentUser.id });
      await ticket.save();
      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        // version: ticket.version,
      });
      res.status(201).send(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal server error");
    }
  }
);

export { router as createTicketRouter };
