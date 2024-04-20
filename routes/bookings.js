const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.findAll);
router.post('/', bookingController.create);
router.get('/:id', bookingController.findOne);
router.put('/:id', bookingController.update);
router.delete('/:id', bookingController.delete);

module.exports = router;


