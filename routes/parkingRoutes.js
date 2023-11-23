import express from 'express';
import { verifyUser, verifyAdmin } from '../middlewares/authMiddleware.js';
import {
  getNearbyParkings,
  getAllParkings,
  getMyParkings,
  addParking,
  updateParking,
  getParkingById,
  deleteParking,
} from '../controllers/parkingController.js';
import {
  getAllSpots,
  addSpot,
  deleteSpot,
} from '../controllers/parkingSpotController.js';
import { bookSpot } from '../controllers/bookingController.js';

const router = express.Router();

router.route('/nearbyParkings').get(verifyUser, getNearbyParkings);
router.route('/').get(getAllParkings).post(verifyUser, verifyAdmin, addParking);

router.route('/myParkings').get(verifyUser, verifyAdmin, getMyParkings);
router
  .route('/:parkingId')
  .get(getParkingById)
  .put(verifyUser, verifyAdmin, updateParking)
  .delete(verifyUser, verifyAdmin, deleteParking);

// Parking Spot Routes
router
  .route('/:parkingId/spots')
  .get(getAllSpots)
  .post(verifyUser, verifyAdmin, addSpot);

router
  .route('/:parkingId/spots/:spotId')
  .delete(verifyUser, verifyAdmin, deleteSpot);

// Booking Routes
router
  .route('/:parkingId/:vehicleId/spots/:spotId/booking')
  .post(verifyUser, bookSpot);
export default router;
