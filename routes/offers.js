const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const offerController = require('../controllers/offerController');


router.get('/search', offerController.searchOffers);
//CRUD
router.get('/', offerController.findAll);
router.post('/', offerController.create);
router.get('/:id', offerController.findOne);
router.put('/:id', offerController.update);
router.delete('/:id', offerController.delete);

module.exports = router;


