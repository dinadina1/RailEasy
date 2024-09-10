// require necessary packages
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

// auth schema
const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [25, "Password cannot exceed 15 characters"],
  },
  phoneno: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
});

// hash password before save
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// generate jwt token
authSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

// compare password
authSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// generate password reset token
authSchema.methods.getResetPasswordToken = function () {
  const randomBytes = CryptoJS.lib.WordArray.random(16);
  this.resetPasswordToken = CryptoJS.enc.Hex.stringify(randomBytes);
  this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000; //10minutes
  return this.resetPasswordToken;
};

// export authSchema
module.exports = mongoose.model("Auth", authSchema);
