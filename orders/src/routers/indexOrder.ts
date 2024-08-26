import express, { Request, Response } from "express";
import { currentUser } from "../../middilware/logined";
import { Order } from "../model/order";
const router = express.Router();

router.get("/api/orders", currentUser, async (req: Request, res: Response) => {
  if (!currentUser) {
    return res.json("login required");
  }
  const allOrder = await Order.find({ userId: req.currentUser?.id }).populate(
    "ticket"
  );

  if (!allOrder) {
    return res.status(400).send("bad request order not found");
  }
  res.status(200).send(allOrder);
});

export { router as listOrderRouter };
