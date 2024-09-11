// require necessary packages
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const auth = require("./routes/auth");
const station = require("./routes/station");
const train = require("./routes/train");
const booking = require("./routes/booking");
const error = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// set .env path
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// parse request body
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://3.84.31.96:8000",
      "http://localhost:8000",
      "http://localhost:5173",
      "http://3.84.31.96",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// set upload folder into static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// use routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/station", station);
app.use("/api/v1/train", train);
app.use("/api/v1/booking", booking);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

app.use(error);

module.exports = app;
