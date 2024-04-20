const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    propertyId: { type: String, required: true, unique: true },
    ownerEmail: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    beds: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Property', propertySchema);
