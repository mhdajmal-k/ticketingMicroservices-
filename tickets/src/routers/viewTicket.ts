import express, { Request, Response } from "express";
import { Ticket } from "../model/ticketmodel";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  // const id=
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404).send("ticket not found");
  }
  res.status(200).send(ticket);
});

export { router as viewTicketRouter };
