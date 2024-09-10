const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter station name"],
    },
    station_code: {
      type: String,
      required: [true, "Please enter station code"],
      unique: true,
    },
    city: {
      type: String,
      required: [true, "Please enter city name"],
    },
    state: {
      type: String,
      required: [true, "Please enter state name"],
    },
    country: {
      type: String,
      required: [true, "Please enter country name"],
    },
    total_platform: {
      type: Number,
      required: [true, "Please enter platform count"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    trains: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Train",
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  { timestamps: true }
);

// export model
module.exports = mongoose.model("Station", stationSchema);
