const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: String, required: true, unique: true },
    propertyId: { type: String, required: true },
    renterId: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    review: String
});

module.exports = mongoose.model('Booking', bookingSchema);
