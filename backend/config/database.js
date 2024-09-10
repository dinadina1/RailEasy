// // require necessory packages
// const mongoose = require("mongoose");

// // function to connect to the database
// const connectDB = async () => {
//   mongoose.connect(process.env.MONGO_URI).then((con) => {
//     console.log(`Database connected with the host: ${con.connection.host}`);
//   });
// };

// // export function
// module.exports = connectDB;

// require necessary packages
const mongoose = require("mongoose");
const AWS = require("aws-sdk");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.join(__dirname, "config", "config.env"),
});

// function to get parameter from AWS SSM (only used in production)
const getParameter = async (parameterName) => {
  const ssm = new AWS.SSM({
    region: process.env.AWS_REGION || "us-east-1", //  AWS region or set in .env
  });

  const params = {
    Name: MONGO_URI, // Name of the parameter in AWS SSM
    WithDecryption: true, // Decrypt the parameter if encrypted
  };

  try {
    const data = await ssm.getParameter(params).promise();
    return data.Parameter.Value; // Return the value of the parameter
  } catch (error) {
    console.error(`Error retrieving parameter ${parameterName}:`, error);
    throw new Error("Failed to retrieve environment variable from SSM");
  }
};

// function to connect to the database
const connectDB = async () => {
  let mongoUri;

  try {
    if (process.env.NODE_ENV === "production") {
      // Retrieve MONGO_URI from AWS SSM if in production
      mongoUri = await getParameter("MONGO_URI");
    } else {
      // Use the local .env MONGO_URI in development
      mongoUri = process.env.MONGO_URI;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if the connection fails
  }
};

// export function
module.exports = connectDB;