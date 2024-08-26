import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["created", "cancelled", "awaiting:payment", "completed"],
    default: "failed",
  },
  expireAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
  },
});

const Order = mongoose.model("Order", OrderSchema);

export { Order };
