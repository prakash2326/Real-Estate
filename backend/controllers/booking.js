const Booking = require("../models/booking.js");
const Property = require("../models/property.js");

module.exports.createBookingApi = async (req, res) => {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
        return res.status(404).json({ error: "Property not found." });
    }

    if (property.available === false) {
        return res.status(409).json({ error: "This property is currently unavailable." });
    }

    const existingBooking = await Booking.findOne({
        property: id,
        client: req.user._id,
    });

    if (existingBooking) {
        return res.status(200).json({ message: "This property is already in your bookings.", data: existingBooking });
    }

    const booking = await Booking.create({
        property: id,
        client: req.user._id,
    });

    return res.status(201).json({ message: "Property booked successfully!", data: booking });
};

module.exports.indexApi = async (req, res) => {
    const bookings = await Booking.find({ client: req.user._id })
        .populate("property")
        .sort({ createdAt: -1 });

    res.json({ data: bookings });
};
