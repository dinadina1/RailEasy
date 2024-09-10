const mongoose = require("mongoose");

const pnrSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  },
  pnr_number: {
    type: String,
    required: [true, "Please enter pnr number"],
  },
  date_of_journey: {
    type: String,
    required: [true, "Please enter date of journey"],
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: [true, "Please enter train number"],
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
  departure_time: {
    type: String,
    required: [true, "Please enter departure time"],
  },
  arrival_time: {
    type: String,
    required: [true, "Please enter arrival time"],
  },
  class: {
    type: String,
    ref: "Class",
    required: [true, "Please enter class"],
  },
  status: {
    type: String,
    enum: ["Booked", "Pending"],
    default: "Pending",
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
      status: {
        type: String,
        enum: ["Confirmed", "Waiting"],
        default: "Waiting",
      },
      berth: {
        type: String,
        required: [true, "Please enter berth"],
      },
    },
  ],
}, {timestamps: true});

module.exports = mongoose.model('Pnr', pnrSchema);
