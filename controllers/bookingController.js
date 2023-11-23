import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Parking from '../models/parkingModel.js';
import ParkingSpot from '../models/parkingSpotModel.js';
import Vehicle from '../models/vehicleModel.js';

const bookSpot = asyncHandler(async (req, res) => {
  // Problem if the user has more than 1 vehicle.
  // const vehicle = await Vehicle.findOne({ where: { userId: req.user.userId } });

  const { startTime, endTime, tax } = req.body;

  const vehicle = await Vehicle.findOne({
    where: { vehicleId: req.params.vehicleId },
  });

  const spot = await ParkingSpot.findOne({
    where: { spotId: req.params.spotId },
  });

  if (spot.status === 'booked') {
    res.status(400);
    throw new Error('Spot already booked. Please select another spot');
  }
  if (spot.spotType !== vehicle.vehicleType) {
    res.status(400);
    throw new Error(
      `The parking spot is for ${spot.spotType}. Your vehicle is ${vehicle.vehicleType}`
    );
  }
  if (spot.fuelType !== vehicle.fuelType) {
    res.status(400);
    throw new Error(
      `The parking spot is for ${spot.fuelType} vehicle. Your vehicle is ${vehicle.fuelType} vehicle`
    );
  }

  const parking = await Parking.findOne({
    where: { parkingId: spot.parkingId },
  });

  parking.availableSlots = parking.availableSlots - 1;

  if (parking.availableSlots === -1) {
    res.status(400);
    throw new Error('Unable to book spot. Parking Full');
  } else {
    const timeDiff =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
      (1000 * 3600);

    const price = timeDiff * spot.rate + tax;

    const booking = await Booking.create({
      vehicleId: req.params.vehicleId,
      spotId: req.params.spotId,
      startTime: startTime,
      endTime: endTime,
      tax: tax,
      totalPrice: price,
    });

    spot.status = 'booked';
    await spot.save();

    res.status(201).json(booking);
  }
});

export { bookSpot };
