import express, { Response, Request } from "express";
import { currentUser } from "../../middilware/logined";
import { Ticket } from "../model/ticketmodel";
import { TicketUpdatePublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats.wrapper";
const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  async (req: Request, res: Response) => {
    if (!currentUser) {
      res.status(400).json("user not found");
      return;
    }
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404).json("ticket not found");
      return;
    }

    if (ticket.orderId) {
      return res
        .status(400)
        .send("ticket is reserved not to update this ticket");
    }

    if (ticket.userId !== req.currentUser?.id) {
      res.status(401).json("update Ticket denied");
      return;
    }
    const { title, price } = req.body;
    if (title.trim() == "" || price == "") {
      res.status(400).json("title and price is required");
    }
    const newTicket = ticket.$set({
      title,
      price,
    });

    await newTicket.save();
    await new TicketUpdatePublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: req.currentUser.id,
    });
    res.status(200).send(newTicket);
  }
);

export { router as updateTicketRouter };
