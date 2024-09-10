// require necessary packages
const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/authenticate");
const { newStation, getAllStations, updateStation, deleteStation, getStation } = require("../controllers/stationController");
const router = express.Router();

router.route('/all').get(getAllStations);

// admin routes
router.route('/admin/new').post(isAuthenticatedUser, authorizeRoles(['admin']), newStation);
router.route('/admin/:id').put(isAuthenticatedUser, authorizeRoles(['admin']), updateStation);
router.route('/admin/:id').delete(isAuthenticatedUser, authorizeRoles(['admin']), deleteStation);
router.route('/admin/:id').get(isAuthenticatedUser, authorizeRoles(['admin']), getStation);


// export router
module.exports = router;