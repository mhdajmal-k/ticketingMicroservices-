import mongoose, { version } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const TicketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // id: {
  //   type: String,
  // },
});

// TicketSchema.set("versionKey", "version");
// TicketSchema.plugin(updateIfCurrentPlugin);

export const Ticket = mongoose.model("Ticket", TicketSchema);
