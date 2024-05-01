const Offer = require('../models/Offer');
const Property = require('../models/Property');
const { checkAvailability } = require('./bookingController');  


// Fonction de recherche multicritères pour les offres
exports.searchOffers = async (req, res) => {
    const { startDate, endDate, city, maxPrice, minBedrooms, minBeds, maxDistance, minRating } = req.query;

    try {
        // Validation initiale des dates
        if (startDate && endDate && parseInt(endDate) < parseInt(startDate)) {
            return res.status(400).send({ message: "La date de fin doit être postérieure à la date de début." });
        }

        const query = {};
        const propertyQuery = {};

        if (city) propertyQuery.city = city;
        if (maxPrice) propertyQuery.price = { $lte: parseInt(maxPrice) };
        if (minBedrooms) propertyQuery.bedrooms = { $gte: parseInt(minBedrooms) };
        if (minBeds) propertyQuery.beds = { $gte: parseInt(minBeds) };
        if (maxDistance) propertyQuery.distance = { $lte: parseInt(maxDistance) };
        if (minRating) propertyQuery.rating = { $gte: parseInt(minRating) };

        // Trouver toutes les propriétés correspondantes d'abord
        const properties = await Property.find(propertyQuery);

        const availableProperties = [];
        for (const property of properties) {
            // Vérifier la disponibilité de chaque propriété
            const isAvailable = startDate && endDate ? await checkAvailability(property._id, parseInt(startDate), parseInt(endDate)) : true;
            if (isAvailable) {
                availableProperties.push(property._id); 
            }
        }

        if (availableProperties.length > 0) {
            // Rechercher des offres qui correspondent aux propriétés disponibles
            query.propertyId = { $in: availableProperties };
            const offers = await Offer.find(query).populate({
                path: 'propertyId',
                select: 'ownerId city street postalCode beds bedrooms distance price rating imageUrl -_id' 
            });
            res.json(offers);
        } else {
            // Si aucune propriété disponible n'est trouvée, renvoyer un tableau vide
            res.json([]);
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "An error occurred while searching for offers." });
    }
};

// Afficher tous les Offer
exports.findAll = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving offers." });
    }
};

// Créer un nouveau Offer
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { offerId, propertyId, startDate, endDate } = req.body;
    const offer = new Offer({
        offerId,
        propertyId,
        startDate,
        endDate,
    });

    try {
        await offer.save();
        res.send(offer);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Offer."
        });
    }
};

// Trouver un Offer par ID
exports.findOne = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).send({
                message: "offer not found with id " + req.params.id
            });
        }
        res.json(offer);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Offer with id " + req.params.id
        });
    }
};

// Mettre à jour un Offer par ID
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false });
        if (!offer) {
            return res.status(404).send({
                message: `Cannot update Offer with id=${req.params.id}. Maybe Offer was not found!`
            });
        }
        res.send({ message: "Offer was updated successfully." });
    } catch (error) {
        res.status(500).send({
            message: "Error updating Offer with id " + req.params.id
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const offer = await Offer.findOneAndDelete({ _id: req.params.id });
        if (!offer) {
            return res.status(404).send({
                message: `Cannot delete Offer with id=${req.params.id}. Maybe Offer was not found!`
            });
        }
        res.send({ message: "Offer was deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send({
            message: "Could not delete Offer with id " + req.params.id
        });
    }
};
