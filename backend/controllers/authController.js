// require necessary packages
const Auth = require("../models/authModel");
const sendJwtToken = require("../utils/jwt");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const sendMail = require("../utils/email");

// register new user - /api/v1/auth/register
exports.registerAuthUser = catchAsyncError(async (req, res, next) => {
  // get data from request body
  const { username, email, password, phoneno } = req.body;

  let user = await Auth.findOne({ email });
  if (user) {
    return next(new ErrorHandler("You already have an account", 400));
  }

  let avatar;

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.file) {
    avatar = `${BASE_URL}/uploads/user/${req.file.uniqueSuffix}-${req.file.originalname}`;
  }

  user = await Auth.create({
    username,
    email,
    password,
    avatar,
    phoneno,
  });

  sendJwtToken(user, 201, res);
});

// loginuser - /api/v1/auth/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Auth.findOne({ email }).select("+password");

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  if (!(await user.isValidPassword(password))) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  sendJwtToken(user, 201, res);
});

// googleLogin - /api/v1/auth/login/google
exports.googleLogin = catchAsyncError(async (req, res, next) => {
  const { email, username, avatar, password } = req.body;
  let user = await Auth.findOne({ email });

  if (!user) {
    user = await Auth.create({
      username,
      email,
      password,
      avatar,
    });
  }

  sendJwtToken(user, 201, res);
});

// forgot password - /api/v1/auth/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await Auth.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }

  //  call getresettoken function
  const resetToken = await user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  let BASE_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

  // Create the HTML email message as a string
  const message = `
    <section style="background-color: #f7fafc; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <div style="padding: 20px; background: linear-gradient(to right, #4299e1, #667eea); text-align: center;">
          <h1 style="font-size: 24px; font-weight: bold; color: #ffffff;">Reset Your Password</h1>
        </div>
        <div style="padding: 20px;">
          <p style="color: #4a5568; margin-bottom: 20px;">
            Hi <strong>${user.username}</strong>,
          </p>
          <p style="color: #4a5568; margin-bottom: 20px;">
            We received a request to reset your password. Click the button below to reset it.
          </p>
          <div style="text-align: center; margin-bottom: 20px;">
            <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #667eea; color: #ffffff; font-weight: bold; padding: 10px 20px; border-radius: 25px; text-decoration: none; transition: background-color 0.3s;">
              Reset Password
            </a>
          </div>
          <p style="color: #4a5568;">
            If you did not request a password reset, please ignore this email or contact support if you have any concerns.
          </p>
          <p style="color: #4a5568; margin-top: 20px;">
            Thanks,<br>
            The ${process.env.SMTP_FROM_NAME} Team
          </p>
        </div>
        <div style="padding: 20px; background-color: #edf2f7; text-align: center; color: #a0aec0; font-size: 12px;">
          © ${new Date().getFullYear()} ${
    process.env.SMTP_FROM_NAME
  }. All rights reserved.
        </div>
      </div>
    </section>
  `;

  try {
    await sendMail({
      email: user.email,
      subject: "RailEasy Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorHandler(error.message, 500));
  }
});

// reset password - /api/v1/auth/password/reset/:token
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const user = await Auth.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid token", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendJwtToken(user, 201, res);
});

// logout user - /api/v1/auth/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// get userProfile - /api/v1/auth/profile
exports.userProfile = catchAsyncError(async (req, res, next) => {
  const user = await Auth.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// create new user - /api/v1/auth/admin/user/new
exports.newUser = catchAsyncError(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  let user = await Auth.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  let avatar;
  if (req.file) {
    avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.uniqueSuffix}-${req.file.originalname}`;
  }

  user = await Auth.create({
    username,
    email,
    password,
    avatar,
    role,
  });

  res.status(201).json({
    success: true,
    message: "User created Success",
    user,
  });
});

// get all users - /api/v1/auth/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await Auth.find();

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// get particular user - /api/v1/auth/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = await Auth.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update particular user - /api/v1/auth/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { username, email, role } = req.body;

  let user = await Auth.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 400)
    );
  }

  let avatar;
  if (req.file) {
    avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.uniqueSuffix}-${req.file.originalname}`;
  }

  user = await Auth.findByIdAndUpdate(
    req.params.id,
    {
      username,
      email,
      avatar,
      role,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "User updated Success",
    user,
  });
});

// change password - /api/v1/auth/user/password/:id
exports.changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Auth.findById(req.params.id).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (!(await user.isValidPassword(oldPassword))) {
    return next(new ErrorHandler("Invalid old password", 400));
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Password updated Success",
  });
});

// delete user - /api/v1/auth/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await Auth.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 400)
    );
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted Success",
  });
});
