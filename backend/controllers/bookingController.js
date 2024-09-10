const catchAsyncError = require("../middlewares/catchAsyncError");
const Booking = require("../models/bookingModel");
const Pnr = require("../models/pnrModel");
const Payment = require("../models/paymentModel");
const Class = require("../models/classModel");
const ErrorHandler = require("../utils/errorHandler");
const Razorpay = require("razorpay");
// const twilio = require("twilio");
const sendMail = require("../utils/email");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const path = require("path");
const fs = require("fs");
const { DateTime } = require("luxon");
const puppeteer = require("puppeteer");
const Document = require("pdfkit");
const crypto = require("crypto");

// function generate booking id
function generateBookingID(lastBookingID) {
  const prefix = "B"; // Prefix for the booking ID
  const numberLength = 4; // Length of the numeric part of the booking ID

  // Extract numeric part from the last booking ID
  const lastNumber = parseInt(lastBookingID.slice(1));

  // Increment the numeric part by 1
  const newNumber = lastNumber + 1;

  // Generate the new booking ID with the specified format
  const newBookingID = prefix + String(newNumber).padStart(numberLength, "0");

  return newBookingID;
}

//function to Initialize Razorpay
// const razorpayCredential = () => {
//   return new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
//   });
// };

// function to generate receipt id
const generateReceiptID = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let receiptId = "receipt_";
  for (let i = 0; i < length; i++) {
    receiptId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return receiptId;
};

// const getTwilioCredential = () => {
//   return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
// };

// create booking = /api/v1/booking/new
exports.createBooking = catchAsyncError(async (req, res, next) => {
  // Get the last booking to generate the new booking ID
  const lastBooking = await Booking.findOne().sort({ booking_id: -1 }).exec();

  let newBookingID;
  if (lastBooking) {
    newBookingID = generateBookingID(lastBooking.booking_id);
  } else {
    newBookingID = "B0001";
  }
  req.body.booking_id = newBookingID;
  req.body.pnr = "66c6383dd284aa6ba874e7b7";

  // Check if the booking ID already exists
  const existingBooking = await Booking.findOne({ booking_id: newBookingID });
  if (existingBooking) {
    return next(new ErrorHandler("Booking ID already exists", 400));
  }

  // Create the booking
  const book = await Booking.create(req.body);

  // Get the last PNR to generate the new PNR number
  const lastPnr = await Pnr.findOne().sort({ pnr_number: -1 }).exec();
  const pnrNumber = lastPnr ? parseInt(lastPnr.pnr_number) + 1 : 100001;

  // Create PNR data
  const pnrData = {
    booking: book._id,
    pnr_number: pnrNumber.toString(),
    date_of_journey: book.date_of_journey,
    train: book.train,
    from_station: book.from_station,
    to_station: book.to_station,
    departure_time: book.departure_time,
    arrival_time: book.arrival_time,
    class: book.class,
    passengers: book.passengers,
  };

  // Insert the PNR data
  const pnr = await Pnr.create(pnrData);
  await Booking.updateOne(
    { _id: book._id },
    { pnr: pnr._id, user: req.user.id }
  );

  // update class seats
  const classData = await Class.findById(book.class);
  if (
    classData.seat_map.find(
      (seat) => seat.date.toString() === book.date_of_journey.toString()
    )
  ) {
    classData.seat_map.find((seat) => {
      if (seat.date.toString() === book.date_of_journey.toString()) {
        seat.available_seats = seat.available_seats - 1;
        seat.booked_seats = seat.booked_seats + 1;
        seat.bookings.push(book._id);
      }
    });
    await classData.save();
  } else {
    classData.seat_map.push({
      date: book.date_of_journey,
      total_seats: classData.total_seats,
      available_seats: classData.total_seats - 1,
      booked_seats: 1,
      bookings: [book._id],
    });
    await classData.save();
  }

  res.status(200).json({
    success: true,
    message: "Booking successful",
    book,
    pnr,
  });
});

exports.createPaymentOrder = catchAsyncError(async (req, res, next) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return next(new ErrorHandler("Amount and currency are required.", 400));
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: generateReceiptID(5),
    payment_capture: 1, // Auto capture
  };

  try {
    const response = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order_id: response.id,
      amount: response.amount,
      currency: response.currency,
      receipt: response.receipt,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

exports.completePayment = catchAsyncError(async (req, res, next) => {
  const { booking_id, status, method, paymentId, order_id, signature } =
    req.body;

  if (!booking_id || !paymentId || !order_id) {
    return next(new ErrorHandler("Missing required payment details.", 400));
  }

  try {
    // Create a new payment record
    const newPayment = {
      transaction_id: paymentId,
      method,
      currency: "INR",
      booking_id,
      amount: req.body.amount, // Assuming amount is in INR
      receipt: order_id,
      status: status || "Success",
    };

    const payment = await Payment.create(newPayment);

    // Update booking status
    let booking = await Booking.findById(booking_id).populate(
      "pnr train from_station to_station boarding_station reservation_upto class user"
    );

    if (!booking) {
      return next(new ErrorHandler("Booking not found.", 404));
    }

    // if (!booking.contact.phone_no.startsWith("+91")) {
    //   booking.contact.phone_no =
    //     "+91" + booking.contact.phone_no.replace(/\D/g, "");
    // }

    booking.payment = payment._id;
    booking.payment_status = "Success";
    booking.booking_status = "Confirmed";
    booking.chart_prepared = true;

    booking.passengers.forEach((passenger) => {
      passenger.status = "Confirmed";
    });

    await booking.save();

    // Update PNR details
    const pnr = await Pnr.findById(booking.pnr);
    if (pnr) {
      pnr.passengers = booking.passengers;
      pnr.status = "Booked";
      await pnr.save();
    }

    // Prepare passenger details for SMS and Email
    let passengerDetailsSMS = "";
    let passengerDetailsEmail = "";
    booking.passengers.forEach((p) => {
      passengerDetailsSMS += `Name: ${p.name}\nSeat: (${p.seat_number})\nBerth: ${p.berth}\n\n`;
      passengerDetailsEmail += `
        <p style="margin: 0; font-size: 18px;"><strong>Name:</strong> ${p.name}</p>
        <p style="margin: 0; font-size: 18px;"><strong>Seat:</strong> ${p.seat_number}</p>
        <p style="margin: 0; font-size: 18px;"><strong>Berth:</strong> ${p.berth}</p>
      `;
    });

    // Send ticket via SMS using Twilio
    // const twilioClient = getTwilioCredential();
    // await twilioClient.messages.create({
    //   body: `Your Train Ticket:\nTrain: ${booking.train.train_number} ${booking.train.name}\nDate: ${booking.date_of_journey}\nDeparture: ${booking.from_station.name} (${booking.from_station.station_code}) at ${booking.departure_time}\nArrival: ${booking.to_station.name} (${booking.to_station.station_code}) at ${booking.arrival_time}\nPassenger:\n${passengerDetailsSMS}PNR: ${booking.pnr.pnr_number}\nStatus: ${booking.booking_status}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: booking.contact.phone_no,
    // });

    // Prepare HTML email content
    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Train Ticket</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #3795BD; padding: 20px; color: #ffffff; text-align: center;">
                  <h1 style="margin: 0;">Your Train Ticket</h1>
              </div>
              <div style="padding: 20px;">
                  <p style="margin: 0; font-size: 18px;"><strong>Train:</strong> ${booking.train.train_number} ${booking.train.name}</p>
                  <p style="margin: 0; font-size: 18px;"><strong>Date:</strong> ${booking.date_of_journey}</p>
                  <p style="margin: 0; font-size: 18px;"><strong>Departure:</strong> ${booking.from_station.name} (${booking.from_station.station_code}) at ${booking.departure_time}</p>
                  <p style="margin: 0; font-size: 18px;"><strong>Arrival:</strong> ${booking.to_station.name} (${booking.to_station.station_code}) at ${booking.arrival_time}</p>
                  <p style="margin: 0; font-size: 18px;"><strong>Passenger:</strong></p>
                  ${passengerDetailsEmail}
                  <p style="margin: 0; font-size: 18px;"><strong>PNR:</strong> ${booking.pnr.pnr_number}</p>
                  <p style="margin: 0; font-size: 18px;"><strong>Status:</strong> ${booking.booking_status}</p>
              </div>
              <div style="background-color: #f1f1f1; padding: 10px 20px; text-align: center;">
                  <p style="margin: 0; font-size: 14px; color: #777;">Thank you for booking with ${process.env.SMTP_FROM_NAME}</p>
                  <p style="margin: 0; font-size: 14px; color: #777;">For any assistance, contact us at support@raileasy.com</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Send email with ticket details
    await sendMail({
      email: booking.contact.email,
      subject: "Train Ticket - RailEasy",
      message: emailContent,
    });

    res.status(201).json({
      success: true,
      message: "Payment successful and ticket sent.",
      payment,
      // smsResponse: responseData, // Ensure responseData is defined or remove if not needed
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// get all bookings - /api/v1/booking/all
exports.getAllBookings = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find()
    .populate(
      "pnr train from_station to_station boarding_station reservation_upto class user"
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// get booking by booking id - /api/v1/booking/single
exports.getBookingByBookingId = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findOne({
    booking_id: req.body.bookingId.toUpperCase(),
  })
    .populate(
      "pnr train from_station to_station boarding_station reservation_upto class user payment"
    )
    .sort({ createdAt: -1 });

  if (!booking) {
    return next(new ErrorHandler("Invalid Booking ID", 404));
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

// get booking by id - /api/v1/booking/single/:id
exports.getBookingById = catchAsyncError(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate(
      "pnr train from_station to_station boarding_station reservation_upto class user payment"
    )
    .sort({ createdAt: -1 });

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  res.status(200).json({
    success: true,
    booking,
  });
});

// update booking - /api/v1/booking/single/:id
exports.updateBooking = catchAsyncError(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    booking,
  });
});

// get all bookings by user - /api/v1/booking/user
exports.getBookingsByUser = catchAsyncError(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate(
      "pnr train from_station to_station boarding_station reservation_upto class user"
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

// get all transaction - /api/v1/booking/admin/payment/all
exports.getAllTransaction = catchAsyncError(async (req, res, next) => {
  const transactions = await Payment.find().populate("booking_id");
  res.status(200).json({
    success: true,
    count: transactions.length,
    transactions,
  });
});

// download daily transaction report - /api/v1/booking/report/dailyreport?date=
exports.getDailyReport = catchAsyncError(async (req, res, next) => {
  // Convert input date to start and end of the day
  const inputDate = req.query.date; // Format: "YYYY-MM-DD"

  // Extract year, month, day in the correct order
  const [year, month, day] = inputDate.split("-").map(Number);

  const startDate = DateTime.fromObject({ year, month, day })
    .startOf("day")
    .toJSDate();
  const endDate = DateTime.fromObject({ year, month, day })
    .endOf("day")
    .toJSDate();

  // Step 1: Perform aggregation to get the IDs of documents
  const transactionIds = await Payment.aggregate([
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$payment_date", startDate] },
            { $lte: ["$payment_date", endDate] },
          ],
        },
      },
    },
    {
      $project: {
        _id: 1, // Include only the _id field (or any other fields you need)
        booking_id: 1, // Include the field that you want to populate
      },
    },
  ]);

  // If no transactions found, return a "No details found" message
  if (transactionIds.length === 0) {
    return next(
      new ErrorHandler("No details found for the selected date", 404)
    );
  }

  // Extract the IDs from the aggregation result
  const ids = transactionIds.map((item) => item._id);

  // Step 2: Populate references using Mongoose's populate method
  const transactions = await Payment.find({ _id: { $in: ids } })
    .populate({
      path: "booking_id",
      populate: {
        path: "train user",
      },
    })
    .exec();

  let bookings = [];

  transactions.forEach((transaction) => {
    if (transaction.booking_id) {
      let trans = {};
      trans.bookingId = transaction.transaction_id;
      trans.train =
        transaction.booking_id.train.train_number +
        " " +
        transaction.booking_id.train.name;
      trans.user = transaction.booking_id.user.username;
      trans.email = transaction.booking_id.user.email;
      trans.amount = transaction.amount;
      trans.date = transaction.payment_date.toLocaleDateString();
      trans.status = transaction.status;
      bookings.push(trans);
    }
  });

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Set page size to A4 (210mm x 297mm)
    const page = pdfDoc.addPage([595.276, 841.89]); // A4 size in points (72 points per inch)

    // Load company logo image
    const logoPath = path.join(__dirname, "..", "images/logo.png");
    const logoImageBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.5);

    // Draw company logo and name
    page.drawImage(logoImage, {
      x: 30,
      y: 750,
      width: logoDims.width,
      height: logoDims.height,
    });

    page.drawText("RailEasy", {
      x: 100,
      y: 770,
      size: 24,
      color: rgb(0.2, 0.84, 0.67), // Company color
    });

    // Title for the report
    page.drawText("Daily Booking Transaction Report", {
      x: 30,
      y: 710,
      size: 20,
      color: rgb(0, 0, 0),
    });

    // Table headers
    let yPosition = 660;
    const headerFontSize = 10;
    const rowFontSize = 8;
    const margin = 20;

    const headers = [
      "Booking ID",
      "Train",
      "Username",
      "Email",
      "Amount",
      "Date",
      "Status",
    ];
    const headerWidths = [100, 130, 80, 100, 50, 50, 50];
    headers.forEach((header, index) => {
      page.drawText(header, {
        x:
          margin +
          headerWidths.slice(0, index).reduce((acc, width) => acc + width, 0),
        y: yPosition,
        size: headerFontSize,
        color: rgb(1, 0, 0),
      });
    });

    yPosition -= 30;

    // Table rows
    bookings.forEach((booking, index) => {
      const rowColor = index % 2 === 0 ? rgb(0.9, 0.9, 0.9) : rgb(1, 1, 1); // Alternating row color
      page.drawRectangle({
        x: margin - 5,
        y: yPosition - 15,
        width: headerWidths.reduce((acc, width) => acc + width, 0) + 10,
        height: 30,
        color: rowColor,
      });

      const rowValues = [
        booking.bookingId,
        booking.train,
        booking.user,
        booking.email,
        `Rs.${booking.amount}`,
        booking.date,
        booking.status,
      ];

      rowValues.forEach((value, index) => {
        page.drawText(value, {
          x:
            margin +
            headerWidths.slice(0, index).reduce((acc, width) => acc + width, 0),
          y: yPosition,
          size: rowFontSize,
          color: rgb(0, 0, 0),
        });
      });

      yPosition -= 30;
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();

    // Set the response headers to trigger a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="daily-booking-report.pdf"'
    );
    res.setHeader("Content-Length", pdfBytes.length);

    // Send the PDF to the browser
    res.end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    return next(new ErrorHandler("Error generating PDF", 500));
  }
});

// download ticket - /api/v1/booking/ticket/download
// exports.downloadTickets = catchAsyncError(async (req, res) => {
//   req.body = {
//     trainDetails: {
//       number: "12345",
//       name: "Express Train",
//       departure: "2024-08-24 10:00",
//       arrival: "2024-08-24 14:00",
//     },
//     passengerList: [
//       { name: "John Doe", age: 30, seat: "12A" },
//       { name: "Jane Smith", age: 25, seat: "12B" },
//     ],
//     paymentDetails: {
//       amount: "50.00",
//       method: "Credit Card",
//       transactionId: "ABC123XYZ",
//     },
//   };

//   const { trainDetails, passengerList, paymentDetails } = req.body;

//   // Define HTML template for the PDF
//   const html = `
//   <!DOCTYPE html>
//   <html>
//   <head>
//       <title>Ticket</title>
//       <style>
//           body {
//               font-family: Arial, sans-serif;
//               margin: 0;
//               padding: 20px;
//           }
//           .container {
//               max-width: 800px;
//               margin: auto;
//               padding: 20px;
//               border: 1px solid #ddd;
//               border-radius: 10px;
//               box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//           }
//           h1 {
//               text-align: center;
//               color: #333;
//           }
//           .section {
//               margin-bottom: 20px;
//           }
//           .section h2 {
//               margin-bottom: 10px;
//               color: #555;
//           }
//           table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 10px 0;
//           }
//           table, th, td {
//               border: 1px solid #ddd;
//           }
//           th, td {
//               padding: 8px;
//               text-align: left;
//           }
//           th {
//               background-color: #f4f4f4;
//           }
//           .logo {
//               text-align: center;
//               margin-bottom: 20px;
//           }
//       </style>
//   </head>
//   <body>
//       <div class="container">
//           <div class="logo">
//               <img src="data:image/png;base64,${fs
//                 .readFileSync(path.join(__dirname, "..", "images/logo.png"))
//                 .toString("base64")}" alt="Company Logo" width="100">
//               <h1>RailEasy</h1>
//           </div>
//           <div class="section">
//               <h2>Train Details</h2>
//               <p><strong>Train Number:</strong> ${trainDetails.number}</p>
//               <p><strong>Train Name:</strong> ${trainDetails.name}</p>
//               <p><strong>Departure:</strong> ${trainDetails.departure}</p>
//               <p><strong>Arrival:</strong> ${trainDetails.arrival}</p>
//           </div>
//           <div class="section">
//               <h2>Passenger List</h2>
//               <table>
//                   <thead>
//                       <tr>
//                           <th>Name</th>
//                           <th>Age</th>
//                           <th>Seat Number</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                       ${passengerList
//                         .map(
//                           (p) => `
//                           <tr>
//                               <td>${p.name}</td>
//                               <td>${p.age}</td>
//                               <td>${p.seat}</td>
//                           </tr>
//                       `
//                         )
//                         .join("")}
//                   </tbody>
//               </table>
//           </div>
//           <div class="section">
//               <h2>Payment Details</h2>
//               <p><strong>Amount Paid:</strong> $${paymentDetails.amount}</p>
//               <p><strong>Payment Method:</strong> ${paymentDetails.method}</p>
//               <p><strong>Transaction ID:</strong> ${
//                 paymentDetails.transactionId
//               }</p>
//           </div>
//       </div>
//   </body>
//   </html>`;

//   // Launch Puppeteer and generate the PDF
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"], // Add arguments if needed for specific environments
//     });
//     const page = await browser.newPage();
//     await page.setContent(html);
//     const pdf = await page.pdf({ format: "A4", printBackground: true });
//     await browser.close();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=ticket.pdf");
//     res.send(pdf);
//   } catch (error) {
//     console.error("Error generating PDF:", error); // Added error logging
//     res.status(500).send("Error generating PDF");
//   }
// });

// get payment by booking id - /api/v1/booking/payment/single/:id
exports.getPaymentByBookingId = catchAsyncError(async (req, res, next) => {
  // Find the payment by booking_id and populate the related fields
  const payment = await Payment.findOne({ booking_id: req.params.id }).populate(
    {
      path: "booking_id",
      populate: [
        { path: "pnr" },
        { path: "from_station" },
        { path: "to_station" },
      ],
    }
  );

  if (!payment) {
    return next(new ErrorHandler("Payment not found", 404));
  }

  res.status(200).json({
    success: true,
    payment,
  });
});

// manual ticket booking - /api/v1/booking/manual
exports.createManualBooking = catchAsyncError(async (req, res, next) => {
  // Generate new booking ID
  const lastBooking = await Booking.findOne().sort({ booking_id: -1 }).exec();
  let newBookingID = lastBooking
    ? generateBookingID(lastBooking.booking_id)
    : "B0001";
  req.body.booking_id = newBookingID;

  // Check if booking ID already exists
  const existingBooking = await Booking.findOne({ booking_id: newBookingID });
  if (existingBooking) {
    return next(new ErrorHandler("Booking ID already exists", 400));
  }

  // Create the booking
  const book = await Booking.create(req.body);

  // Generate new PNR number
  const lastPnr = await Pnr.findOne().sort({ pnr_number: -1 }).exec();
  const pnrNumber = lastPnr ? parseInt(lastPnr.pnr_number) + 1 : 100001;

  // Create PNR data
  const pnrData = {
    booking: book._id,
    pnr_number: pnrNumber.toString(),
    date_of_journey: book.date_of_journey,
    train: book.train,
    from_station: book.from_station,
    to_station: book.to_station,
    boarding_station: book.boarding_station,
    reservation_upto: book.reservation_upto,
    departure_time: book.departure_time,
    arrival_time: book.arrival_time,
    class: book.class,
    passengers: book.passengers,
    contact: book.contact,
  };

  // Insert the PNR data
  const pnr = await Pnr.create(pnrData);
  await Booking.updateOne(
    { _id: book._id },
    { pnr: pnr._id, user: req.user.id }
  );

  // Update class seats for the specific date
  const classData = await Class.findById(book.class);
  const seatForDate = classData.seat_map.find(
    (seat) => seat.date.toString() === book.date_of_journey.toString()
  );

  if (seatForDate) {
    seatForDate.available_seats -= book.passengers.length;
    seatForDate.booked_seats += book.passengers.length;
    seatForDate.bookings.push(book._id);
  } else {
    classData.seat_map.push({
      date: book.date_of_journey,
      total_seats: classData.total_seats,
      available_seats: classData.total_seats - book.passengers.length,
      booked_seats: book.passengers.length,
      bookings: [book._id],
    });
  }

  await classData.save();

  const bookRes = await Booking.findById(book._id)
    .populate(
      "pnr train from_station to_station boarding_station reservation_upto class user payment"
    )
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Booking successful",
    booking: bookRes,
  });
});

// download ticket - /api/v1/booking/ticket/download
exports.downloadTicket = catchAsyncError(async (req, res, next) => {
  const bookingId = req.params.bookingId;

  // Step 1: Find the booking by ID and populate related data
  const booking = await Booking.findById(bookingId).populate(
    "train from_station to_station class user pnr train.route"
  );

  if (!booking) {
    return next(new ErrorHandler("Booking not found", 404));
  }

  const departureTime = booking?.train?.route?.find((station) =>
    station.station.equals(booking?.from_station._id)
  )?.departure_time;
  const arrivalTime = booking?.train?.route?.find((station) =>
    station.station.equals(booking?.to_station._id)
  )?.arrival_time;

  try {
    // Step 2: Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.276, 841.89]); // A4 size in points

    // Load company logo image (optional)
    const logoPath = path.join(__dirname, "..", "images/logo.png");
    const logoImageBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.3); // Adjust size as needed

    // Embed default fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Draw the logo and company name
    page.drawImage(logoImage, {
      x: 30,
      y: 780,
      width: logoDims.width,
      height: logoDims.height,
    });

    page.drawText("RailEasy", {
      x: 100,
      y: 780,
      size: 28,
      color: rgb(0.2, 0.84, 0.67), // Company color
      font: boldFont,
    });

    // Train Information Section
    page.drawText("Train Information", {
      x: 30,
      y: 700,
      size: 18,
      color: rgb(0, 0, 0), // Black text color
      font: boldFont,
    });

    page.drawText(`Train Name: ${booking?.train?.name}`, {
      x: 30,
      y: 680,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(`Train Number: ${booking?.train?.train_number}`, {
      x: 30,
      y: 660,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(
      `Source Station: ${booking?.from_station?.name} (${booking?.from_station?.station_code})`,
      {
        x: 30,
        y: 640,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      }
    );

    page.drawText(
      `Destination Station: ${booking?.to_station?.name} (${booking?.to_station?.station_code})`,
      {
        x: 30,
        y: 620,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      }
    );

    page.drawText(`Date of Journey: ${booking?.date_of_journey}`, {
      x: 30,
      y: 600,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(`Departure Time: ${departureTime || "N/A"}`, {
      x: 30,
      y: 580,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(`Arrival Time: ${arrivalTime || "N/A"}`, {
      x: 30,
      y: 560,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    // Ticket Information Section
    page.drawText("Ticket Information", {
      x: 30,
      y: 530,
      size: 18,
      color: rgb(0, 0, 0), // Black text color
      font: boldFont,
    });

    page.drawText(
      `Booking Date: ${new Date(booking?.booking_date).toLocaleDateString()}`,
      {
        x: 30,
        y: 510,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      }
    );

    page.drawText(`Class: ${booking?.class?.name.toUpperCase()}`, {
      x: 30,
      y: 490,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(`Fare: Rs. ${booking?.total_fare}`, {
      x: 30,
      y: 470,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    page.drawText(`Payment Status: ${booking?.payment_status}`, {
      x: 30,
      y: 450,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    // PNR Information Section
    page.drawText("PNR Information", {
      x: 30,
      y: 420,
      size: 18,
      color: rgb(0, 0, 0), // Black text color
      font: boldFont,
    });

    page.drawText(`PNR Number: ${booking?.pnr?.pnr_number}`, {
      x: 30,
      y: 400,
      size: 14,
      color: rgb(0, 0, 0),
      font,
    });

    // Passenger Information Section
    page.drawText("Passenger Information", {
      x: 30,
      y: 370,
      size: 18,
      color: rgb(0, 0, 0), // Black text color
      font: boldFont,
    });

    let yOffset = 350; // Adjust y-offset dynamically based on passenger list

    booking?.passengers?.forEach((passenger, index) => {
      page.drawText(`Passenger ${index + 1}. Name: ${passenger?.name}`, {
        x: 30,
        y: yOffset,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      });

      yOffset -= 20;
      page.drawText(`Age: ${passenger?.age} | Gender: ${passenger?.gender}`, {
        x: 30,
        y: yOffset,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      });

      yOffset -= 20;
      page.drawText(
        `Berth: ${passenger?.berth} | Seat Number: ${passenger?.seat_number}`,
        {
          x: 30,
          y: yOffset,
          size: 14,
          color: rgb(0, 0, 0),
          font,
        }
      );

      yOffset -= 20;
      page.drawText(`Booking Status: ${passenger?.status}`, {
        x: 30,
        y: yOffset,
        size: 14,
        color: rgb(0, 0, 0),
        font,
      });

      yOffset -= 30;
    });

    // Step 4: Serialize the PDF to bytes and send as a response
    const pdfBytes = await pdfDoc.save();

    // Set headers to trigger a download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="train-ticket-${booking?.booking_id}.pdf"`
    );
    res.setHeader("Content-Length", pdfBytes.length);

    // Send the PDF file
    res.end(Buffer.from(pdfBytes));
  } catch (error) {
    console.error("Error generating PDF:", error);
    return next(new ErrorHandler("Error generating PDF", 500));
  }
});
