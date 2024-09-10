const mongoose = require("mongoose");

// train class schema
const trainClassSchema = new mongoose.Schema({
  train_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: [true, "Please enter fare"],
  },
  total_seats: {
    type: Number,
    required: [true, "Please enter total seats"],
  },
  status: {
    type: String,
    default: "available",
    enum: ["available", "unavailable"],
  },
  amentities: {
    type: [String],
    required: [true, "Please enter amenities"],
  },
  seat_map: [
    {
      date: {
        type: String,
        required: [true, "Please enter date"],
      },
      total_seats: {
        type: Number,
        required: [true, "Please enter total seats"],
      },
      available_seats: {
        type: Number,
        required: [true, "Please enter available seats"],
      },
      booked_seats: {
        type: Number,
        required: [true, "Please enter booked seats"],
        default: 0,
      },
      bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      }]
    },
  ],

}, {timestamps: true});

// export schema
module.exports = mongoose.model("Class", trainClassSchema);