const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerId: { type: String, required: true, unique: true },
    propertyId: { type: String, required: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
});

module.exports = mongoose.model('Offer', offerSchema);
