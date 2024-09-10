const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const { createBooking, createPayment, getAllBookings, getBookingByBookingId, updateBooking, getAllTransaction, getBookingsByUser, getDailyReport, downloadTicket, createPaymentOrder, completePayment, getPaymentByBookingId, getBookingById, createManualBooking } = require('../controllers/bookingController');

router.route("/new").post(isAuthenticatedUser, createBooking);
router.route("/payment/order").post(isAuthenticatedUser, createPaymentOrder);
router.route("/payment/new").post(isAuthenticatedUser, completePayment);
router.route("/payment/:id").get(isAuthenticatedUser, getPaymentByBookingId);
router.route("/all").get(isAuthenticatedUser, getAllBookings);
router.route("/admin/single").post(isAuthenticatedUser, authorizeRoles(['admin']), getBookingByBookingId);
router.route("/single/:id").put(isAuthenticatedUser, updateBooking);
router.route("/single/:id").get(isAuthenticatedUser, getBookingById);
router.route("/manual").post(isAuthenticatedUser, createManualBooking);

router.route("/admin/payment/all").get(isAuthenticatedUser, authorizeRoles(['admin']), getAllTransaction);
router.route("/user").get(isAuthenticatedUser, getBookingsByUser);
router.route("/report/dailyreport").get( getDailyReport);
router.route("/ticket/download/:bookingId").get( downloadTicket);

module.exports = router;