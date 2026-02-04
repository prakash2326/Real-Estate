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

// GET listings by category
// INDEX ROUTE
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category; // enum value
    }

    const allListings = await Listing.find(filter);

    if (!allListings || allListings.length === 0) {
      req.flash("error", "No listings found for this category!");
      return res.redirect("/listings");
    }

    res.render("listings/index", { allListings });
  } catch (err) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

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