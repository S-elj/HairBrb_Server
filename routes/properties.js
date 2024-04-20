const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');

router.get('/', propertyController.findAll);
router.post('/', propertyController.create);
router.get('/:id', propertyController.findOne);
router.put('/:id', propertyController.update);
router.delete('/:id', propertyController.delete);

module.exports = router;
