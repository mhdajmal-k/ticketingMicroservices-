import express, { Request, Response } from "express";
import { Ticket } from "../model/ticketmodel";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res, Response) => {
  console.log("hi");
  const ticket = await Ticket.find({});
  if (ticket.length == 0) {
    res.status(404).send("not ticket available");
    return;
  }
  res.status(200).send(ticket);
});

export { router as listTickets };
