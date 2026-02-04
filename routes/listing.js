const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ListingController = require("../controllers/listing.js")
const multer = require('multer')
const {storage} = require("../cloudinaryConfig.js")
const upload = multer({storage})

const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

router
    .route("/")
    .get(wrapAsync(ListingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync( ListingController.CreateListing)
    );


//New Route
router.get("/new",isLoggedIn,ListingController.renderNewform);

router
    .route("/:id")
    .get( wrapAsync(ListingController.showListings))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.renderUpdateForm))
    .delete(isLoggedIn,isOwner,wrapAsync(ListingController.renderDestroyForm ));



//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.renderEditForm));

module.exports = router;