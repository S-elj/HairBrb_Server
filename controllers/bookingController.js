const Booking = require('../models/Booking');
const Offer = require('../models/Offer'); 


// Afficher tous les bookings
exports.findAll = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving bookings." });
    }
};


// Créer un nouveau booking
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { propertyId, renterEmail, startDate, endDate, review } = req.body;

    const available = await checkAvailability(propertyId, startDate, endDate);
    if (!available) {
        return res.status(400).send({
            message: "Property is not available for the requested dates."
        });
    }

    const booking = new Booking({
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


exports.getAvailability = async (req, res) => {
    const { propertyId } = req.query;
    try {
        const bookings = await Booking.find({
            propertyId: propertyId,
            startDate: { $exists: true },
            endDate: { $exists: true }
        }).lean();

        const bookedPeriods = bookings.map(booking => {
            const startDate = parseDate(booking.startDate);
            const endDate = parseDate(booking.endDate);

            return { startDate, endDate };
        });
    
        res.status(200).json(bookedPeriods);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
};

// Fonction pour convertir YYYYMMDD en un objet Date
function parseDate(dateNumber) {
    const dateString = dateNumber.toString();
    const year = parseInt(dateString.substring(0, 4), 10);
    const month = parseInt(dateString.substring(4, 6), 10) - 1; // Les mois en JS sont indexés à partir de 0
    const day = parseInt(dateString.substring(6, 8), 10);
    return new Date(year, month, day);
}


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
module.exports.checkAvailability = checkAvailability;  

