import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/vehicleController.js';
import { verifyUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(verifyUser, getAllVehicles).post(verifyUser, addVehicle);
router
  .route('/:vehicleId')
  .get(verifyUser, getVehicleById)
  .put(verifyUser, updateVehicle)
  .delete(verifyUser, deleteVehicle);

export default router;
