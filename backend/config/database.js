// backend/config/database.js

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "config", "config.env"), // adjust if needed
});

// Import AWS SDK v3 SSM client
const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

// Create SSM client (v3)
const ssm = new SSMClient({ region: "ap-south-1" });

// Function to get parameter from AWS SSM (used in production)
const getParameter = async (parameterName) => {
  try {
    const command = new GetParameterCommand({
      Name: parameterName, // use '/MONGO_URI' if your parameter name starts with a slash
      WithDecryption: true,
    });

    const response = await ssm.send(command);
    return response.Parameter.Value;
  } catch (error) {
    console.error(`Error retrieving parameter ${parameterName}:`, error);
    throw new Error("Failed to retrieve environment variable from SSM");
  }
};

// Function to connect to MongoDB
const connectDB = async () => {
  let mongoUri;

  try {
    console.log(`🚀 Environment: ${process.env.NODE_ENV}`);

    if (process.env.NODE_ENV === "production") {
      mongoUri = await getParameter("MONGO_URI"); // or "/MONGO_URI" if that’s your exact SSM name
    } else {
      mongoUri = process.env.MONGO_URI;
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

// // require necessary packages
// const mongoose = require("mongoose");
// const AWS = require("aws-sdk");
// const path = require("path");
// const dotenv = require("dotenv").config({
//   path: path.join(__dirname, "config", "config.env"),
// });

// // Configure AWS region (update if your parameter is in another region)
// AWS.config.update({ region: "ap-south-1" });

// // Create SSM client
// const ssm = new AWS.SSM();

// // function to get parameter from AWS SSM (only used in production)
// const getParameter = async (parameterName) => {
//   try {
//     const data = await ssm
//       .getParameter({
//         Name: parameterName.startsWith("/") ? parameterName : `/${parameterName}`, // ensures correct format
//         WithDecryption: true,
//       })
//       .promise();

//     return data.Parameter.Value;
//   } catch (error) {
//     console.error(`Error retrieving parameter ${parameterName}:`, error);
//     throw new Error("Failed to retrieve environment variable from SSM");
//   }
// };

// // function to connect to the database
// const connectDB = async () => {
//   let mongoUri;

//   try {
//     if (process.env.NODE_ENV === "production") {
//       // Retrieve MONGO_URI from AWS SSM if in production
//       mongoUri = await getParameter("MONGO_URI");
//     } else {
//       // Use the local .env MONGO_URI in development
//       mongoUri = process.env.MONGO_URI;
//     }

//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("✅ Database connected successfully");
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//     process.exit(1); // Exit the process if the connection fails
//   }
// };

// // export function
// module.exports = connectDB;

// // require necessary packages
// const mongoose = require("mongoose");
// const AWS = require("aws-sdk");
// const path = require("path");
// const dotenv = require("dotenv").config({
//   path: path.join(__dirname, "config", "config.env"),
// });

// // function to get parameter from AWS SSM (only used in production)
// const getParameter = async (parameterName) => {
//   const ssm = new AWS.SSM({
//     region: process.env.AWS_REGION || "us-east-1", // AWS region or set in .env
//   });

//   const params = {
//     Name: parameterName, // Name of the parameter in AWS SSM
//     WithDecryption: true, // Decrypt the parameter if encrypted
//   };

//   try {
//     const data = await ssm.getParameter(params).promise();
//     return data.Parameter.Value; // Return the value of the parameter
//   } catch (error) {
//     console.error(`Error retrieving parameter ${parameterName}:`, error);
//     throw new Error("Failed to retrieve environment variable from SSM");
//   }
// };

// // function to connect to the database
// const connectDB = async () => {
//   let mongoUri;

//   try {
//     // if (process.env.NODE_ENV === "production") {
//     //   // Retrieve MONGO_URI from AWS SSM if in production
//     //   mongoUri = await getParameter("MONGO_URI");
//     // } else {
//       // Use the local .env MONGO_URI in development
//       mongoUri = process.env.MONGO_URI;
//     // }

//     await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     process.exit(1); // Exit the process if the connection fails
//   }
// };

// // export function
// module.exports = connectDB;
