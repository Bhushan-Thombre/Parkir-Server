import asyncHandler from 'express-async-handler';
import Vehicle from '../models/vehicleModel.js';

const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.findAll({
    where: { userId: req.user.userId },
  });
  res.status(201).json(vehicles);
});

const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    where: { vehicleId: req.params.vehicleId },
  });
  res.status(201).json(vehicle);
});

const addVehicle = asyncHandler(async (req, res) => {
  const { name, vehicleType, fuelType, image, numberPlate } = req.body;

  const vehicleData = await Vehicle.findOne({
    where: { numberPlate: numberPlate },
  });
  if (vehicleData) {
    res.status(400);
    throw new Error('Vehicle already exists. Add another vehicle.');
  }

  const vehicle = await Vehicle.create({
    userId: req.user.userId,
    name: name,
    vehicleType: vehicleType,
    fuelType: fuelType,
    image: image,
    numberPlate: numberPlate,
  });

  res.status(201).json(vehicle);
});

const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    where: { vehicleId: req.params.vehicleId },
  });
  if (vehicle) {
    await vehicle.destroy();
    res.json({ message: 'Vehicle removed' });
  } else {
    res.status(404);
    throw new Error('Vehicle not found.');
  }
});

const updateVehicle = asyncHandler(async (req, res) => {
  const { name, vehicleType, fuelType, image, numberPlate } = req.body;

  const vehicle = await Vehicle.findOne({
    where: { vehicleId: req.params.vehicleId },
  });

  if (vehicle) {
    vehicle.name = name || vehicle.name;
    vehicle.vehicleType = vehicleType || vehicle.vehicleType;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.image = image || vehicle.image;
    vehicle.numberPlate = numberPlate || vehicle.numberPlate;

    const updatedVehicle = await vehicle.save();

    res.status(201).json(updatedVehicle);
  } else {
    res.status(404);
    throw new Error('Vehicle not found.');
  }
});

export {
  getAllVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById,
};
