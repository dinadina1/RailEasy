const mongoose = require("mongoose");

// train model schema
const trainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter train name"],
    },
    train_number: {
      type: String,
      required: [true, "Please enter train number"],
      unique: true,
    },
    source_station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Please enter source station"],
    },
    destination_station: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Please enter destination station"],
    },
    route: [
      {
        station: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Station",
          required: [true, "Please enter station"],
        },
        route_number: {
          type: Number,
          required: [true, "Please enter route number"],
        },
        arrival_time: {
          type: String,
          required: [true, "Please enter arrival time"],
        },
        departure_time: {
          type: String,
          required: [true, "Please enter departure time"],
        },
        halt_time: {
          type: String,
          required: [true, "Please enter halt time"],
        },
        distance: {
          type: Number,
          required: [true, "Please enter distance"],
        },
        journey_duration: {
          type: String
        },
      },
    ],
    type: {
      type: String,
      required: [true, "Please enter train type"],
      enum: [
        "Superfast",
        "Express",
        "Mail",
        "Passenger",
        "Local",
        "MemuExpress",
      ],
    },
    day_of_operation: {
      type: [String],
      required: [true, "Please enter day of operation"],
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    return_day_of_operation: {
      type: [String],
      required: [true, "Please enter return day of operation"],
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    base_fare: {
      type: String,
      required: [true, "Please enter base fare"],
    },
    tax_percent: {
      type: Number,
      default: 0.5
    },
    class: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    facilities: [String],
    current_status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
    stations: [String],
    classes: [String],
    category: {
      type: String,
      default: "General"
    },
    return_route: [
      {
        station: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Station",
        },
        route_number: {
          type: Number,
          required: [true, "Please enter route number"],
        },
        arrival_time: {
          type: String,
          required: [true, "Please enter arrival time"],
        },
        departure_time: {
          type: String,
          required: [true, "Please enter departure time"],
        },
        halt_time: {
          type: String,
          required: [true, "Please enter halt time"],
        },
        distance: {
          type: Number,
          required: [true, "Please enter distance"],
        },
        journey_duration: {
          type: String,
        },
      },
    ],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth"
    }
  },
  { timestamps: true }
);

// export model
module.exports = mongoose.model("Train", trainSchema);
