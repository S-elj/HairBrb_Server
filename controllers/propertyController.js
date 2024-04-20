const Property = require('../models/Property');

// Retrieve all properties
exports.findAll = async (req, res) => {
    try {
        const properties = await Property.find();
        res.json(properties);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving properties." });
    }
};

// Create a new property
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    const { propertyId, ownerEmail, city, street, postalCode, beds, bedrooms, distance, price } = req.body;
    const property = new Property({
        propertyId,
        ownerEmail,
        city,
        street,
        postalCode,
        beds,
        bedrooms,
        distance,
        price
    });

    try {
        await property.save();
        res.send(property);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the Property."
        });
    }
};

// Find a single property by ID
exports.findOne = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).send({
                message: "Property not found with id " + req.params.id
            });
        }
        res.json(property);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving Property with id " + req.params.id
        });
    }
};

// Update a property by ID
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update cannot be empty!"
        });
    }

    try {
        const property = await Property.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false });
        if (!property) {
            return res.status(404).send({
                message: `Cannot update Property with id=${req.params.id}. Maybe Property was not found!`
            });
        }
        res.send({ message: "Property was updated successfully." });
    } catch (error) {
        res.status(500).send({
            message: "Error updating Property with id " + req.params.id
        });
    }
};

// Delete a property by ID
exports.delete = async (req, res) => {
    try {
        const property = await Property.findOneAndDelete({ _id: req.params.id });
        if (!property) {
            return res.status(404).send({
                message: `Cannot delete property with id=${req.params.id}. Maybe property was not found!`
            });
        }
        res.send({ message: "property was deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send({
            message: "Could not delete property with id " + req.params.id
        });
    }
};

