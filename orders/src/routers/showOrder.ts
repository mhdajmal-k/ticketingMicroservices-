import express, { Request, Response } from "express";
import { currentUser } from "../../middilware/logined";
import { Order } from "../model/order";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  currentUser,
  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.json("login Required");
    }
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order || order.userId !== req.currentUser?.id) {
      return res.status(404).json(" order not found");
    }
    res.status(200).send(order);
  }
);

export { router as getOrderRouter };
