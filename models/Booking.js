const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    propertyId: { type: String, required: true },
    renterEmail: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    review: String
});

module.exports = mongoose.model('Booking', bookingSchema);
