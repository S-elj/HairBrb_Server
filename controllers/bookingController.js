const Booking = require('../models/Booking');

// Afficher tous les bookings
exports.findAll = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving bookings." });
    }
};

const Booking = require('../models/Booking');
const Offer = require('../models/Offer'); // Assurez-vous d'avoir un modèle pour les offres

// Créer un nouveau booking
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { bookingId, propertyId, renterEmail, startDate, endDate, review } = req.body;

    // Vérifier si la propriété est disponible pour les dates demandées
    const available = await checkAvailability(propertyId, startDate, endDate);
    if (!available) {
        return res.status(400).send({
            message: "Property is not available for the requested dates."
        });
    }

    const booking = new Booking({
        bookingId,
        propertyId,
        renterEmail,
        startDate,
        endDate,
        review
    });

    try {
        await booking.save();
        res.send(booking);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Booking."
        });
    }
};

async function checkAvailability(propertyId, startDate, endDate) {
    // Vérifier les réservations existantes
    const bookings = await Booking.find({
        propertyId: propertyId,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    });

    return bookings.length === 0; // Si aucun booking ne chevauche les dates, la propriété est disponible
}


// Trouver un booking par ID
exports.findOne = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).send({
                message: "Booking not found with id " + req.params.id
            });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Booking with id " + req.params.id
        });
    }
};

// Mettre à jour un booking par ID
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false });
        if (!booking) {
            return res.status(404).send({
                message: `Cannot update Booking with id=${req.params.id}. Maybe Booking was not found!`
            });
        }
        res.send({ message: "Booking was updated successfully." });
    } catch (error) {
        res.status(500).send({
            message: "Error updating Booking with id " + req.params.id
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const booking = await Booking.findOneAndDelete({ _id: req.params.id });
        if (!booking) {
            return res.status(404).send({
                message: `Cannot delete Booking with id=${req.params.id}. Maybe Booking was not found!`
            });
        }
        res.send({ message: "Booking was deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send({
            message: "Could not delete Booking with id " + req.params.id
        });
    }
};


async function checkAvailability(propertyId, startDate, endDate) {
    const bookings = await Booking.find({
        propertyId: propertyId,
        // Recherche de tout booking qui chevauche effectivement la période demandée
        $or: [
            { startDate: { $lte: endDate, $gte: startDate } }, // Le début du booking existant est entre le début et la fin demandés
            { endDate: { $lte: endDate, $gte: startDate } }, // La fin du booking existant est entre le début et la fin demandés
            { startDate: { $lte: startDate }, endDate: { $gte: endDate } } // Le booking existant englobe complètement la période demandée
        ]
    });

    return bookings.length === 0; 
}
