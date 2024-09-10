const mongoose = require("mongoose");
const { create } = require("./pnrModel");

const bookingSchema = new mongoose.Schema({
  booking_id: {
    type: String,
    required: [true, "Please enter booking id"],
    unique: true,
  },
  pnr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pnr"
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: [true, "Please enter train"],
  },
  date_of_journey: {
    type: String,
    required: [true, "Please enter date of journey"],
  },
  from_station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: [true, "Please enter from station"],
  },
  to_station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: [true, "Please enter to station"],
  },
  boarding_station: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: [true, "Please enter boarding station"],
  },
  reservation_upto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    required: [true, "Please enter reservation upto"],
  },
  departure_time: {
    type: String,
    required: [true, "Please enter departure time"],
  },
  arrival_time: {
    type: String,
    required: [true, "Please enter arrival time"],
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Please enter class"],
  },
  total_fare: {
    type: Number,
    required: [true, "Please enter total fare"],
  },
  booking_status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Cancelled"],
  },
  payment_status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Success", "Failed"],
  },
  chart_prepared: {
    type: Boolean,
    default: false,
  },
  passengers: [
    {
      name: {
        type: String,
        required: [true, "Please enter passenger name"],
      },
      age: {
        type: Number,
        required: [true, "Please enter passenger age"],
      },
      gender: {
        type: String,
        required: [true, "Please enter passenger gender"],
      },
      seat_number: {
        type: String,
        required: [true, "Please enter seat number"],
      },
      berth: {
        type: String,
        required: [true, "Please enter berth"],
      },
      status: {
        type: String,
        default: "Waiting",
        enum: ["Confirmed", "Waiting"],
      },
    },
  ],
  booking_date: {
    type: Date,
    default: Date.now,
  },
  contact: {
    phone_no: {
      type: String,
      required: [true, "Please enter phone number"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  cancellation: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
