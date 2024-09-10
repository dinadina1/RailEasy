const catchAsyncError = require("../middlewares/catchAsyncError");
const Train = require("../models/trainModel");
const Class = require("../models/classModel");
const Station = require("../models/stationModel");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/ApiFeatures");
const Pnr = require("../models/pnrModel");
const Booking = require("../models/bookingModel");

// create new train - /api/v1/train/admin/new
// exports.newTrain = catchAsyncError(async (req, res, next) => {
//   let stations = await Station.find();

//   // Check if the train number or name already exists
//   const trains = await Train.find();
//   if (trains.find((train) => train.train_number === req.body.train_number)) {
//     return next(new ErrorHandler("Train number already exists", 400));
//   }
//   if (trains.find((train) => train.name === req.body.name)) {
//     return next(new ErrorHandler("Train name already exists", 400));
//   }

//   // Extract class object from req.body
//   let trainClass = req.body.class;
//   let filteredObject = Object.fromEntries(
//     Object.entries(req.body).filter(([key]) => key !== "class")
//   );

//   req.body.name = req.body.name.toUpperCase();
//   // Create the new train
//   const train = await Train.create(filteredObject);

//   // Add train_id to each class object and insert them
//   const classObj = trainClass.map((cls) => {
//     cls.train_id = train._id;
//     return cls;
//   });
//   const classes = await Class.insertMany(classObj);

//   // Add class IDs to the train
//   train.class = classes.map((cls) => cls._id);

//   // // Function to add 0 before hours
//   // function formatJourneyDuration(journey_duration) {
//   //   const [hours, minutes] = journey_duration.split(":");

//   //   // Add leading zero to hours and minutes if they are less than 10
//   //   const formattedHours = parseInt(hours) < 10 ? `0${hours}` : hours;
//   //   const formattedMinutes = parseInt(minutes) < 10 ? `0${minutes}` : minutes;

//   //   return `${formattedHours}:${formattedMinutes}`;
//   // }

//   // // Calculate journey_duration for each route segment
//   // let route = [];
//   // for (let i = 0; i < train.route.length; i++) {
//   //   let journey_duration = 0;
//   //   if (i > 0) {
//   //     let departure = train.route[i - 1].departure_time.replace(":", ".");
//   //     let arrival = train.route[i].arrival_time.replace(":", ".");
//   //     journey_duration = (arrival - departure).toFixed(2).replace(".", ":");

//   //     journey_duration = formatJourneyDuration(journey_duration);
//   //   } else {
//   //     journey_duration = train.route[i].arrival_time;
//   //   }
//   //   route.push({
//   //     ...train.route[i],
//   //     journey_duration: journey_duration,
//   //   });
//   // }

//   // Calculate journey_duration for each return route segment
//   // let returnRoute = [];
//   // for (let i = 0; i < train.return_route.length; i++) {
//   //   let journey_duration = 0;
//   //   if (i > 0) {
//   //     let departure = train.return_route[i - 1].departure_time.replace(
//   //       ":",
//   //       "."
//   //     );
//   //     let arrival = train.return_route[i].arrival_time.replace(":", ".");
//   //     journey_duration = (arrival - departure).toFixed(2).replace(".", ":");

//   //     journey_duration = formatJourneyDuration(journey_duration);
//   //   } else {
//   //     journey_duration = train.return_route[i].arrival_time;
//   //   }
//   //   returnRoute.push({
//   //     ...train.return_route[i],
//   //     journey_duration: journey_duration,
//   //   });
//   // }

//   // Helper function to convert "hh:mm" to minutes
// function timeToMinutes(time) {
//   let [hours, minutes] = time.split(':').map(Number);
//   return hours * 60 + minutes;
// }

// // Helper function to convert minutes to "hh:mm" format
// function minutesToTime(minutes) {
//   let hours = Math.floor(minutes / 60);
//   let mins = minutes % 60;
//   return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
// }

// // Calculate journey duration for each route segment
// let route = [];
// for (let i = 0; i < train.route.length; i++) {
//   let journey_duration = "00:00";
//   if (i > 0) {
//     let previousDepartureTime = train.route[i - 1].departure_time;
//     let currentArrivalTime = train.route[i].arrival_time;

//     // Convert times to minutes
//     let departureInMinutes = timeToMinutes(previousDepartureTime);
//     let arrivalInMinutes = timeToMinutes(currentArrivalTime);

//     // Calculate the duration, adjusting for crossing midnight
//     let durationInMinutes = arrivalInMinutes - departureInMinutes;
//     if (durationInMinutes < 0) {
//       durationInMinutes += 24 * 60; // Adjust if the time crosses midnight
//     }

//     // Convert the duration back to "hh:mm" format
//     journey_duration = minutesToTime(durationInMinutes);
//   } else {
//     journey_duration = train.route[i].arrival_time; // First station duration is the arrival time
//   }

//   // Add the route segment with calculated journey_duration
//   route.push({
//     ...train.route[i],
//     journey_duration: journey_duration,
//   });
// }

// let returnRoute = [];
// for (let i = 0; i < train.return_route.length; i++) {
//   let journey_duration = "00:00";
//   if (i > 0) {
//     let previousDepartureTime = train.return_route[i - 1].departure_time;
//     let currentArrivalTime = train.return_route[i].arrival_time;

//     // Convert times to minutes
//     let departureInMinutes = timeToMinutes(previousDepartureTime);
//     let arrivalInMinutes = timeToMinutes(currentArrivalTime);

//     // Calculate the duration, adjusting for crossing midnight
//     let durationInMinutes = arrivalInMinutes - departureInMinutes;
//     if (durationInMinutes < 0) {
//       durationInMinutes += 24 * 60; // Adjust if the time crosses midnight
//     }

//     // Convert the duration back to "hh:mm" format
//     journey_duration = minutesToTime(durationInMinutes);
//   } else {
//     journey_duration = train.return_route[i].arrival_time; // First station duration is the arrival time
//   }

//   // Add the route segment with calculated journey_duration
//   returnRoute.push({
//     ...train.return_route[i],
//     journey_duration: journey_duration,
//   });
// }


//   // Update the train with route information
//   train.route = route;
//   train.return_route = returnRoute;

//   train.classes = req.body.class.map((cls) => cls.name);
//   train.created_by = req.user._id;
//   await train.save();

//   // Update stations with the new train ID
//   train.route.forEach(async (station) => {
//     let stationToUpdate = await Station.findById(station.station);
//     if (stationToUpdate) {
//       stationToUpdate.trains.push(train._id);
//       await stationToUpdate.save();
//     }
//   });

//   const updatedTrains = await Train.findById(train._id).populate(
//     "source_station destination_station route.station return_route.station created_by class"
//   );
//   updatedTrains.stations = updatedTrains.route.map(
//     (station) => station.station.name
//   );
//   await updatedTrains.save();

//   res.status(201).json({
//     success: true,
//     message: "Train created successfully",
//     train,
//   });
// });

exports.newTrain = catchAsyncError(async (req, res, next) => {
  let stations = await Station.find();

  // Check if the train number or name already exists
  const trains = await Train.find();
  if (trains.find((train) => train.train_number === req.body.train_number)) {
    return next(new ErrorHandler("Train number already exists", 400));
  }
  if (trains.find((train) => train.name === req.body.name)) {
    return next(new ErrorHandler("Train name already exists", 400));
  }

  // Extract class object from req.body
  let trainClass = req.body.class;
  let filteredObject = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => key !== "class")
  );

  req.body.name = req.body.name.toUpperCase();

  // Create the new train
  const train = await Train.create(filteredObject);

  // Add train_id to each class object and insert them
  const classObj = trainClass.map((cls) => {
    cls.train_id = train._id;
    return cls;
  });
  const classes = await Class.insertMany(classObj);

  // Add class IDs to the train
  train.class = classes.map((cls) => cls._id);

  // Helper function to convert "hh:mm" to minutes
  function timeToMinutes(time) {
    let [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Helper function to convert minutes to "hh:mm" format
  function minutesToTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Calculate journey duration for each route segment
  let route = train.route.map((segment, i) => {
    let journey_duration = "00:00";
    if (i > 0) {
      let previousDepartureTime = train.route[i - 1].departure_time;
      let currentArrivalTime = segment.arrival_time;

      // Convert times to minutes
      let departureInMinutes = timeToMinutes(previousDepartureTime);
      let arrivalInMinutes = timeToMinutes(currentArrivalTime);

      // Calculate the duration, adjusting for crossing midnight
      let durationInMinutes = arrivalInMinutes - departureInMinutes;
      if (durationInMinutes < 0) {
        durationInMinutes += 24 * 60; // Adjust if the time crosses midnight
      }

      // Convert the duration back to "hh:mm" format
      journey_duration = minutesToTime(durationInMinutes);
    } else {
      journey_duration = segment.arrival_time; // First station duration is the arrival time
    }

    return {
      ...segment,
      journey_duration: journey_duration,
    };
  });

  // Calculate journey duration for each return route segment
  let returnRoute = train.return_route.map((segment, i) => {
    let journey_duration = "00:00";
    if (i > 0) {
      let previousDepartureTime = train.return_route[i - 1].departure_time;
      let currentArrivalTime = segment.arrival_time;

      // Convert times to minutes
      let departureInMinutes = timeToMinutes(previousDepartureTime);
      let arrivalInMinutes = timeToMinutes(currentArrivalTime);

      // Calculate the duration, adjusting for crossing midnight
      let durationInMinutes = arrivalInMinutes - departureInMinutes;
      if (durationInMinutes < 0) {
        durationInMinutes += 24 * 60; // Adjust if the time crosses midnight
      }

      // Convert the duration back to "hh:mm" format
      journey_duration = minutesToTime(durationInMinutes);
    } else {
      journey_duration = segment.arrival_time; // First station duration is the arrival time
    }

    return {
      ...segment,
      journey_duration: journey_duration,
    };
  });

  // Update the train with route information
  train.route = route;
  train.return_route = returnRoute;

  train.classes = req.body.class.map((cls) => cls.name);
  train.created_by = req.user._id;
  await train.save();

  // Update stations with the new train ID
  await Promise.all(
    train.route.map(async (station) => {
      let stationToUpdate = await Station.findById(station.station);
      if (stationToUpdate) {
        stationToUpdate.trains.push(train._id);
        await stationToUpdate.save();
      }
    })
  );

  const updatedTrain = await Train.findById(train._id).populate(
    "source_station destination_station route.station return_route.station created_by class"
  );

  updatedTrain.stations = updatedTrain.route.map(
    (station) => station.station.name
  );
  await updatedTrain.save();

  res.status(201).json({
    success: true,
    message: "Train created successfully",
    train: updatedTrain,
  });
});


// get all trains - /api/v1/train/all
exports.getAllTrains = catchAsyncError(async (req, res, next) => {
  const trains = await Train.find().populate(
    "source_station destination_station route.station return_route.station created_by class"
  );

  res.status(200).json({
    success: true,
    count: trains.length,
    trains,
  });
});

// get single train - /api/v1/train/:id
exports.getTrain = catchAsyncError(async (req, res, next) => {
  const train = await Train.findById(req.params.id).populate(
    "source_station destination_station route.station return_route.station created_by class"
  );

  if (!train) {
    return next(
      new ErrorHandler(`Train not found with id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    train,
  });
});

// get train schedule - /api/v1/train/schedule/:id
exports.getTrainSchedule = catchAsyncError(async (req, res, next) => {
  const train = await Train.findOne({train_number: req.params.id}).populate(
    "source_station destination_station route.station return_route.station created_by class"
  );

  if (!train) {
    return next(
      new ErrorHandler(`Invalid train number`, 400)
    );
  }

  res.status(200).json({
    success: true,
    train,
  });
});

// update train - /api/v1/train/admin/:id
exports.updateTrain = catchAsyncError(async (req, res, next) => {
  let train = await Train.findById(req.params.id);

  if (!train) {
    return next(
      new ErrorHandler(`Train not found with id: ${req.params.id}`, 400)
    );
  }

  // Check if the train number or name already exists
  const trains = await Train.find();
  if (
    trains.find(
      (train) =>
        train.train_number === req.body.train_number &&
        req.body.train_number !== train.train_number
    )
  ) {
    return next(new ErrorHandler("Train number already exists", 400));
  }
  if (
    trains.find(
      (train) =>
        train.name.toLowerCase() === req.body.name.toLowerCase() &&
        req.body.name.toLowerCase() !== train.name.toLowerCase()
    )
  ) {
    return next(new ErrorHandler("Train name already exists", 400));
  }

  req.body.name = req.body.name.toUpperCase();

  train = await Train.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Train updated successfully",
    train,
  });
});

// delete train - /api/v1/train/admin/:id
exports.deleteTrain = catchAsyncError(async (req, res, next) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    return next(
      new ErrorHandler(`Train not found with id: ${req.params.id}`, 400)
    );
  }

  // Delete related classes associated with the train
  await Class.deleteMany({ train_id: train._id });

  // delete or update related stations
  await Station.updateMany(
    { trains: train._id },
    { $pull: { trains: train._id } }
  );

  // Delete the train
  await train.deleteOne();

  res.status(200).json({
    success: true,
    message: "Train deleted successfully",
  });
});

// search trains - /api/v1/train/search
exports.searchTrains = catchAsyncError(async (req, res, next) => {
  const { from, to, classname } = req.query;

  // Assuming `ApiFeatures` is a utility class you are using for filtering/searching
  const trainsQuery = new ApiFeatures(Train.find(), req.query).search();

  // Populate relevant fields
  const trains = await trainsQuery.query.populate(
    "source_station destination_station route.station return_route.station created_by class"
  );

  // Return the response
  res.status(200).json({
    success: true,
    count: trains.length,
    trains,
  });
});

// get pnr status - /api/v1/train/pnr/status/:pnr
exports.getPnrStatus = catchAsyncError(async (req, res, next) => {
  const pnr = await Pnr.findOne({ pnr_number: req.body.pnrNumber }).populate(
    "train booking from_station to_station class"
  );

  if (!pnr) {
    return next(new ErrorHandler("Invalid PNR number", 400));
  }

  res.status(200).json({
    success: true,
    pnr,
  });
});

// get fare details - /api/v1/train/fare
exports.getTrainFare = catchAsyncError(async (req, res, next) => {
  const { trainId, journeyDate, source, destination, classId } = req.body;
  const train = await Train.findById(trainId)
    .populate(
      "source_station destination_station route.station return_route.station created_by class"
    )
    .exec();
  if (!train) {
    return next(new ErrorHandler("Train not found", 404));
  }
  let fare = 0;
  let sourceDistance = 0;
  let sourceDuration = 0;
  let destinationDistance = 0;
  let tax = train.tax_percent;
  let status = null;
  let classname = null;
  let classFares = [];

  let fares = {
    train_number: train.train_number,
    train_name: train.name,
    sourceStation: null,
    destinationStation: null,
    classFares,
  };

  train.class.forEach((cls) => {
    fare = cls.fare;
    status = cls.status;
    classname = cls.name;

    train.route.forEach((station) => {
      if (station.station._id.toString() == source.toString()) {
        sourceDistance += station.distance;
      }
    });
    train.route.forEach((station) => {
      if (station.station._id.toString() == destination.toString()) {
        destinationDistance += station.distance;
      }
    });

    let sourceStation = train.route.find((station) =>
      station.station._id.toString() === source.toString()
        ? station.station.name
        : null
    );
    let destinationStation = train.route.find((station) =>
      station.station._id.toString() === destination.toString()
        ? station.station.name
        : null
    );

    fares.sourceStation = sourceStation.station.name;
    fares.destinationStation = destinationStation.station.name;

    let fareDetails = {};

    fareDetails.distance = destinationDistance - sourceDistance;
    fareDetails.farePerKm = train.base_fare;
    fareDetails.base_fare = train.base_fare * fareDetails.distance + fare;
    fareDetails.total_fare =
      fareDetails.base_fare + (fareDetails.base_fare / 100) * tax;
    fareDetails.tax = (fareDetails.base_fare / 100) * tax;
    fareDetails.taxPercentage = tax;
    fareDetails.journey_date = journeyDate;
    fareDetails.status = status;
    fareDetails.class = classname;

    classFares.push(fareDetails);
    fare = 0;
    sourceDistance = 0;
    sourceDuration = 0;
    destinationDistance = 0;
    tax = train.tax_percent;
    status = null;
    classname = null;
  });

  res.status(200).json({
    success: true,
    fares,
  });
});

// get reservation chart - /api/v1/train/reservation/chart
exports.getReservationChartByTrain = catchAsyncError(async (req, res, next) => {
  const { trainid, date, boardingstation } = req.query;

  if (trainid && boardingstation && date) {
    var bookings = await Booking.find({
      $and: [
        { train: trainid },
        { boarding_station: boardingstation },
        { date_of_journey: date },
      ],
    })
      .populate("train from_station to_station boarding_station user pnr class")
      .sort({ createdAt: -1 });

      var train = await Train.findById(trainid).populate("class source_station destination_station");
      var station = await Station.findById(boardingstation);

    // Process bookings as needed
  } else {
    return next(
      new ErrorHandler("One or more required parameters are missing.", 400)
    );
  }

  if (!bookings.length) {
    return next(new ErrorHandler("Reservation chart not prepared", 404));
  }

  const filteredReservations = bookings.filter((booking) => {
    return booking.booking_status.toLowerCase() === "confirmed" && booking.payment_status.toLowerCase() === "success";
  });
  const totalBookings = filteredReservations.length;
  const reservationData = {
    train,
    station,
    totalBookings,
    bookings: filteredReservations,
  }

  res.status(200).json({
    success: true,
    bookings: reservationData
  });
});

