import asyncHandler from 'express-async-handler';
import Parking from '../models/parkingModel.js';
import User from '../models/userModel.js';
import { Sequelize } from 'sequelize';

// Can be changed if location is grabbed by Point. DataTypes.GEOMETRY('POINT', 4326)
// Haversine formula is used to calculate the circular distance between 2 points on a sphere if the latitude and longitude are given.
// SPID = Spatial reference identifier.
const getNearbyParkings = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { userId: req.user.userId } });

  const nearbyParkings = await Parking.findAll({
    attributes: [
      [
        Sequelize.literal(
          `(6371000 * ACOS(COS(RADIANS(${user.lat})) * COS(RADIANS(lat)) * COS(RADIANS(long) - RADIANS(${user.long})) + SIN(RADIANS(${user.lat})) * SIN(RADIANS(lat))))`
        ),
        'distance_m',
      ],
    ],
    where: Sequelize.literal(
      `(6371000 * ACOS(COS(RADIANS(${user.lat})) * COS(RADIANS(lat)) * COS(RADIANS(long) - RADIANS(${user.long})) + SIN(RADIANS(${user.lat})) * SIN(RADIANS(lat)))) < 5000`
    ),
    order: Sequelize.literal(`distance_m`),
  });

  if (nearbyParkings) {
    res.status(201).json(nearbyParkings);
  } else {
    res.status(404);
    throw new Error('Parkings not Found');
  }
});

const getAllParkings = asyncHandler(async (req, res) => {
  const parkings = await Parking.findAll();
  res.status(201).json(parkings);
});

const getMyParkings = asyncHandler(async (req, res) => {
  const parkings = await Parking.findAll({
    where: { userId: req.user.userId },
  });
  res.status(201).json(parkings);
});

const addParking = asyncHandler(async (req, res) => {
  const parking = await Parking.create({
    userId: req.user.userId,
    name: 'Sample name',
    totalSlots: 10,
    availableSlots: 10,
    image: '',
    address: 'Sample address',
    city: 'Sample city',
    state: 'Sample state',
    country: 'Sample country',
    pinCode: 431001,
  });

  res.status(201).json(parking);
});

const updateParking = asyncHandler(async (req, res) => {
  const {
    name,
    totalSlots,
    availableSlots,
    image,
    address,
    city,
    state,
    country,
    pinCode,
    lat,
    long,
  } = req.body;

  const parking = await Parking.findOne({
    where: { parkingId: req.params.parkingId },
  });

  if (parking) {
    parking.name = name || parking.name;
    parking.totalSlots = totalSlots || parking.totalSlots;
    parking.availableSlots = availableSlots || parking.availableSlots;
    parking.image = image || parking.image;
    parking.address = address || parking.address;
    parking.city = city || parking.city;
    parking.state = state || parking.state;
    parking.country = country || parking.country;
    parking.pinCode = pinCode || parking.pinCode;
    parking.lat = lat || parking.lat;
    parking.long = long || parking.long;

    const updatedParking = await parking.save();

    res.status(201).json(updatedParking);
  } else {
    res.status(404);
    throw new Error('Parking not found');
  }
});

const getParkingById = asyncHandler(async (req, res) => {
  const parking = await Parking.findOne({
    where: { parkingId: req.params.parkingId },
  });
  if (parking) {
    res.status(201);
    res.json(parking);
  } else {
    res.status(404);
    throw new Error('Parking not found');
  }
});

const deleteParking = asyncHandler(async (req, res) => {
  const parking = await Parking.findOne({
    where: { parkingId: req.params.parkingId },
  });
  if (parking) {
    await parking.destroy();
    res.json({ message: 'Parking Removed' });
  } else {
    res.status(404);
    throw new Error('Parking not found');
  }
});

export {
  getNearbyParkings,
  getAllParkings,
  getMyParkings,
  addParking,
  updateParking,
  getParkingById,
  deleteParking,
};
