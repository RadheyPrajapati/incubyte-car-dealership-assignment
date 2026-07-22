const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const { restrictToAdmin } = require('../middleware/adminMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { createVehicleSchema } = require('../validators/vehicleValidator');

router.get('/search', vehicleController.searchVehicles);

router
  .route('/')
  .get(vehicleController.getAllVehicles)
  .post(
    protect,
    restrictToAdmin,
    validate(createVehicleSchema),
    vehicleController.createVehicle
  );

router
  .route('/:id')
  .put(protect, restrictToAdmin, vehicleController.updateVehicle)
  .delete(protect, restrictToAdmin, vehicleController.deleteVehicle);

module.exports = router;
