const catchAsyncError = require("../middlewares/catchAsyncError");
const Station = require("../models/stationModel");
const ErrorHandler = require("../utils/errorHandler");

// create new station - /api/v1/station/admin/new
exports.newStation = catchAsyncError(async (req, res, next) => {
  const stations = await Station.find();
  if (
    stations.find(
      (station) =>
        station.station_code.toUpperCase() ===
          req.body.station_code.toUpperCase() ||
        station.name.toUpperCase() === req.body.name.toUpperCase()
    )
  ) {
    return next(new ErrorHandler("Station code or name already exists", 400));
  }

  req.body.created_by = req.user.id;

  const station = await Station.create(req.body);
  res.status(201).json({
    success: true,
    message: "Station created successfully",
    station,
  });
});

// get all stations - /api/v1/station/all
exports.getAllStations = catchAsyncError(async (req, res, next) => {
  const stations = await Station.find().populate("trains");

  res.status(200).json({
    success: true,
    count: stations.length,
    stations,
  });
});

// get particular station - /api/v1/station/admin/:id
exports.getStation = catchAsyncError(async (req, res, next) => {
  const station = await Station.findById(req.params.id).populate("trains");

  if (!station) {
    return next(
      new ErrorHandler(`Station not found with id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    station,
  });
});

// update particular station - /api/v1/station/admin/:id
exports.updateStation = catchAsyncError(async (req, res, next) => {
  let station = await Station.findById(req.params.id).populate("trains");

  if (!station) {
    return next(
      new ErrorHandler(`Station not found with id: ${req.params.id}`, 400)
    );
  }

  const stations = await Station.find();

  // Check for station code uniqueness
  if (req.body.station_code) {
    const stationWithCode = stations.find(
      (s) =>
        s.station_code.toUpperCase() === req.body.station_code.toUpperCase() &&
        s._id.toString() !== req.params.id // Exclude current station from the check
    );
    if (stationWithCode) {
      return next(new ErrorHandler("Station code already exists", 400));
    }
  }

  // Check for station name uniqueness
  if (req.body.name) {
    const stationWithName = stations.find(
      (s) =>
        s.name.toUpperCase() === req.body.name.toUpperCase() &&
        s._id.toString() !== req.params.id // Exclude current station from the check
    );
    if (stationWithName) {
      return next(new ErrorHandler("Station name already exists", 400));
    }
  }

  // Update the station
  station = await Station.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Station updated successfully",
    station,
  });
});

// delete particular station - /api/v1/station/admin/:id
exports.deleteStation = catchAsyncError(async (req, res, next) => {
  const station = await Station.findById(req.params.id);

  if (!station) {
    return next(
      new ErrorHandler(`Station not found with id: ${req.params.id}`, 400)
    );
  }

  await station.deleteOne();

  res.status(200).json({
    success: true,
    message: "Station deleted successfully",
  });
});
