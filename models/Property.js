const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    propertyId: { type: String, required: true, unique: true },
    ownerId: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    beds: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, require: false } 

});

module.exports = mongoose.model('Property', propertySchema);
