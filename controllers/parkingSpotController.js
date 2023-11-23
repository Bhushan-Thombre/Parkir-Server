import asyncHandler from 'express-async-handler';
import ParkingSpot from '../models/parkingSpotModel.js';
import Parking from '../models/parkingModel.js';

const getAllSpots = asyncHandler(async (req, res) => {
  const spots = await ParkingSpot.findAll();
  res.status(201).json(spots);
});

const addSpot = asyncHandler(async (req, res) => {
  const { floor, spotNumber, rate, spotType, fuelType } = req.body;

  const parking = await Parking.findOne({
    where: { parkingId: req.params.parkingId },
  });

  if (spotNumber > parking.totalSlots) {
    res.status(400);
    throw new Error(`The parking has only ${parking.totalSlots} slots`);
  }

  const spotData = await ParkingSpot.findOne({
    where: { floor: floor, spotNumber: spotNumber },
  });

  if (spotData) {
    res.status(400);
    throw new Error('Spot Already Exists. Add another spot');
  }

  const spot = await ParkingSpot.create({
    parkingId: req.params.parkingId,
    floor: floor,
    spotNumber: spotNumber,
    rate: rate,
    spotType: spotType,
    fuelType: fuelType,
    status: 'available',
  });

  // parking.totalSlots = parking.totalSlots + 1;
  // parking.availableSlots = parking.availableSlots + 1;
  // await parking.save();

  res.status(201).json(spot);
});

const deleteSpot = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const spot = await ParkingSpot.findOne({
    where: { spotId: req.params.spotId },
  });

  const parking = await Parking.findOne({
    where: { parkingId: spot.parkingId },
  });

  if (userId !== parking.userId) {
    res.status(401);
    throw new Error('Unauthorized');
  }

  if (spot) {
    await spot.destroy();
    // const parking = await Parking.findOne({
    //   where: { parkingId: req.params.parkingId },
    // });
    // parking.totalSlots = parking.totalSlots - 1;
    // parking.availableSlots = parking.availableSlots - 1;
    // await parking.save();
    res.json({ message: 'Spot Removed' });
  } else {
    res.status(404);
    throw new Error('Parking not found');
  }
});

export { getAllSpots, addSpot, deleteSpot };
