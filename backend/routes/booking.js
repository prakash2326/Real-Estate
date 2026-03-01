const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const BookingController = require("../controllers/booking.js");
const { isLoggedIn, isClient } = require("../middleware.js");

router.get("/", isLoggedIn, isClient, wrapAsync(BookingController.index));

module.exports = router;
