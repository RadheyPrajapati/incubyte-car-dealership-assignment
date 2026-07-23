const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { restrictToAdmin } = require('../middleware/adminMiddleware');

router.get('/my-purchases', protect, inventoryController.getMyPurchases);
router.post('/:id/purchase', protect, inventoryController.purchaseVehicle);
router.post('/:id/restock', protect, restrictToAdmin, inventoryController.restockVehicle);

module.exports = router;
