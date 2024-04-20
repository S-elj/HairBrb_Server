const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/User'); 
const Property = require('./models/Property'); 
const Booking = require('./models/Booking'); 


const usersRouter = require('./routes/users');
const propertiesRouter = require('./routes/properties');
const bookingsRouter = require('./routes/bookings');

const mongoDB = "mongodb://localhost:27017/HAIRBRB";

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json());

app.use('/users', usersRouter);
app.use('/properties', propertiesRouter);
app.use('/bookings', bookingsRouter);


// Routes de base
app.get('/', (req, res) => {
    res.send('Bienvenue sur notre application de location de logements!');
});


// Définition du port et mise en marche du serveur
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}...`);
});

