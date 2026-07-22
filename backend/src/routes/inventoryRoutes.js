const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id/purchase', protect, inventoryController.purchaseVehicle);

module.exports = router;
