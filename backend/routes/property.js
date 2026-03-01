const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const PropertiesController = require("../controllers/properties.js")
const BookingController = require("../controllers/booking.js");
const multer = require('multer')
const {storage} = require("../cloudinaryConfig.js")
const upload = multer({storage})

const {isLoggedIn,isAdmin,isClient,validateProperty} = require("../middleware.js");

router
    .route("/")
    .get(wrapAsync(PropertiesController.index))
    .post(isAdmin,upload.single("property[image]"),validateProperty,wrapAsync( PropertiesController.CreateProperty)
    );

//New Route
router.get("/new",isAdmin,PropertiesController.renderNewform);
router.post("/:id/bookings", isLoggedIn, isClient, wrapAsync(BookingController.createBooking));

router
    .route("/:id")
    .get( wrapAsync(PropertiesController.showProperties))
    .put(isAdmin,upload.single("property[image]"),validateProperty,wrapAsync(PropertiesController.renderUpdateForm))
    .delete(isAdmin,wrapAsync(PropertiesController.renderDestroyForm ));



//Edit Route
router.get("/:id/edit",isAdmin,wrapAsync(PropertiesController.renderEditForm));

module.exports = router;

