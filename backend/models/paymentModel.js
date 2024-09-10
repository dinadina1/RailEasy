const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    required: [true, "Please enter transaction id"],
  },
  method: {
    type: String,
    required: [true, "Please enter razorpay payment method"],
  },
  currency: {
    type: String,
    required: [true, "Please enter currency"],
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: [true, "Please enter booking id"],
  },
  amount: {
    type: Number,
    required: [true, "Please enter amount"],
  },
  receipt: {
    type: String,
    required: [true, "Please enter receipt"],
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Success", "Failed"],
  },
  payment_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
