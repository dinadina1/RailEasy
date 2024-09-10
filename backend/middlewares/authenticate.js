const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Auth = require("../models/authModel");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  // Get token from cookies
  let token = req.cookies.token || req.headers.authorization && req.headers.authorization.split(" ")[1];

  // If no token found in either place, return an error
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user and attach to the request object
  req.user = await Auth.findOne({_id: decoded.id});  

  next();
});

exports.authorizeRoles = (roles, req, res, next) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
