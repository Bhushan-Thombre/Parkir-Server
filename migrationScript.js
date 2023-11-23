import { connectDB } from './config/db.js';
import syncronize from './config/syncronization.js';
import users from './data/users.js';
import parkings from './data/parkings.js';
import parkingSpots from './data/parkingSpots.js';
import ParkingSpot from './models/parkingSpotModel.js';
import Parking from './models/parkingModel.js';
import User from './models/userModel.js';
import Booking from './models/bookingModel.js';
import Vehicle from './models/vehicleModel.js';
import dotenv from 'dotenv';
import colors from 'colors';

dotenv.config();
connectDB();
syncronize();

const importData = async () => {
  try {
    await Booking.truncate();
    await Vehicle.truncate();
    await ParkingSpot.truncate();
    await Parking.truncate();
    await User.truncate();

    const createdUsers = await User.bulkCreate(users);
    const adminUser = await User.findOne({ where: { isAdmin: true } });

    const sampleParkings = parkings.map((parking) => {
      return { ...parking, userId: adminUser.userId };
    });

    const createdParkings = await Parking.bulkCreate(sampleParkings);
    const parkingOne = await Parking.findOne({
      where: { parkingId: 1 },
    });

    const sampleParkingSpots = parkingSpots.map((parkingSpot) => {
      return { ...parkingSpot, parkingId: parkingOne.parkingId };
    });
    const createdParkingSpots = await ParkingSpot.bulkCreate(
      sampleParkingSpots
    );

    console.log('Data imported successfully'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.truncate();
    await Vehicle.truncate();
    await ParkingSpot.truncate();
    await Parking.truncate();
    await User.truncate();

    console.log('Data destroyed successfully'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
