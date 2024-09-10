// require necessary packages
const connectDB = require("./config/database");
const app = require("./app");

// connect db
connectDB();

// start server
app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV}`
  );
});
