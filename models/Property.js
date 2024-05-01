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
        min: 0,   // Valeur minimale pour les étoiles
        max: 5    // Valeur maximale pour les étoiles
    },
    imageUrl: { type: String, required: false }

}); // Empêche Mongoose de créer automatiquement un champ _id

// Assurez-vous d'enregistrer le modèle avec le bon paramètre pour _id
mongoose.model('Property', propertySchema);


module.exports = mongoose.model('Property', propertySchema);
