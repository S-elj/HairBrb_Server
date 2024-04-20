const User = require('../models/User');

// Afficher tous les utilisateurs
exports.findAll = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving users." });
    }
};

// Créer un nouvel utilisateur
exports.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { email, firstName, lastName, phone } = req.body;
    const user = new User({
        email,
        firstName,
        lastName,
        phone
    });

    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send({
            message: error.message || "Some error occurred while creating the User."
        });
    }
};

// Trouver un utilisateur par ID
exports.findOne = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.id
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving User with id " + req.params.id
        });
    }
};

// Mettre à jour un utilisateur par ID
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false });
        if (!user) {
            return res.status(404).send({
                message: `Cannot update User with id=${req.params.id}. Maybe User was not found!`
            });
        }
        res.send({ message: "User was updated successfully." });
    } catch (error) {
        res.status(500).send({
            message: "Error updating User with id " + req.params.id
        });
    }
};

// Supprimer un utilisateur par ID
exports.delete = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });
        if (!user) {
            return res.status(404).send({
                message: `Cannot delete user with id=${req.params.id}. Maybe user was not found!`
            });
        }
        res.send({ message: "user was deleted successfully!" });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).send({
            message: "Could not delete user with id " + req.params.id
        });
    }
};
