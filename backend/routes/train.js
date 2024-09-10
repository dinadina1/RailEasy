const express = require('express');
const router = express.Router();
const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/authenticate');
const { newTrain, getAllTrains, getTrain, updateTrain, deleteTrain, searchTrains, getPnrStatus, getReservationChartByTrain, getTrainFare, getTrainSchedule } = require('../controllers/trainController');

router.route("/all").get( getAllTrains);
router.route("/single/:id").get(isAuthenticatedUser, getTrain);
router.route("/schedule/:id").get(isAuthenticatedUser, getTrainSchedule);
router.route("/search").get(isAuthenticatedUser, searchTrains);
router.route("/pnr").post(isAuthenticatedUser, getPnrStatus);
router.route("/reservationchart").get(isAuthenticatedUser, getReservationChartByTrain);
router.route("/fare").post(isAuthenticatedUser, getTrainFare);

// admin routes
router.route("/admin/new").post(isAuthenticatedUser, authorizeRoles(['admin']), newTrain);
router.route("/admin/:id").put(isAuthenticatedUser, authorizeRoles(['admin']), updateTrain);
router.route("/admin/:id").delete(isAuthenticatedUser, authorizeRoles(['admin']), deleteTrain);


module.exports = router;