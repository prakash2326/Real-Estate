const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync =require("../utils/wrapAsync.js");
const reviewControllers = require("../controllers/reviews.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");

// Reviews
// Post Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.CreateReview));
//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.DestroyReview));


module.exports = router;