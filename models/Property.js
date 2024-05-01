const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true }, // Définir _id explicitement comme String
    ownerId: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    beds: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    distance: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: {
        type: Number,
        required: true,
        min: 0,  
        max: 5   
    },
    imageUrl: { type: String, required: false }

}); 

mongoose.model('Property', propertySchema);
module.exports = mongoose.model('Property', propertySchema);
