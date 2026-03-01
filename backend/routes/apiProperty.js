const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const PropertiesController = require("../controllers/properties.js");
const BookingController = require("../controllers/booking.js");
const ReviewController = require("../controllers/reviews.js");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig.js");
const upload = multer({ storage });
const { isLoggedIn, isAdmin, isClient, validateProperty, validateReview, isReviewAuthor } = require("../middleware.js");

router.get("/", wrapAsync(PropertiesController.indexApi));
router.post("/", isLoggedIn, isAdmin, upload.single("property[image]"), validateProperty, wrapAsync(PropertiesController.createApi));
router.get("/:id", wrapAsync(PropertiesController.showApi));
router.put("/:id", isLoggedIn, isAdmin, upload.single("property[image]"), validateProperty, wrapAsync(PropertiesController.updateApi));
router.delete("/:id", isLoggedIn, isAdmin, wrapAsync(PropertiesController.destroyApi));
router.post("/:id/bookings", isLoggedIn, isClient, wrapAsync(BookingController.createBookingApi));
router.post("/:id/reviews", isLoggedIn, validateReview, wrapAsync(ReviewController.createReviewApi));
router.delete("/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.destroyReviewApi));

module.exports = router;
