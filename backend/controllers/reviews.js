const Review = require("../models/reviews.js");
const Property = require("../models/property.js");

module.exports.createReviewApi = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        return res.status(404).json({ error: "Property not found" });
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.authorModel = req.user.constructor.modelName;
    property.reviews.push(newReview);

    await newReview.save();
    await property.save();

    return res.status(201).json({ message: "Review created", data: newReview });
};

module.exports.destroyReviewApi = async (req, res) => {
    const { id, reviewId } = req.params;
    await Property.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) {
        return res.status(404).json({ error: "Review not found" });
    }
    return res.json({ message: "Review deleted" });
};
