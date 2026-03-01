const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    property: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

bookingSchema.index({ property: 1, client: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
