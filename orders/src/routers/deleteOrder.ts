import express, { Request, Response } from "express";
import { Order } from "../model/order";
import { currentUser } from "../../middilware/logined";
import { OrderCancelledPublisher } from "../event/publisher/order-canceld-publisher";
import { natsWrapper } from "../nats.wrapper";
const router = express.Router();

router.put(
  "/api/orders/:orderId",
  currentUser,

  async (req: Request, res: Response) => {
    if (!req.currentUser) {
      return res.status(401).json("Login Required");
    }
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (!order || order.userId !== req.currentUser?.id) {
      return res.status(404).json(" order not found");
    }
    order.status = "cancelled";
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket?.id,
      },
      // version: order.__v,
    });
    console.log("hidiofhdihfildhfiohd");
    res.status(200).send("order deleted");
  }
);

export { router as deleteOrderRouter };
