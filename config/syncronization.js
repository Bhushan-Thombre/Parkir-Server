import { sequelize } from './db.js';
import User from '../models/userModel.js';
import Parking from '../models/parkingModel.js';
import ParkingSpot from '../models/parkingSpotModel.js';
import Vehicle from '../models/vehicleModel.js';
import Booking from '../models/bookingModel.js';

User.hasMany(Parking, { onUpdate: 'CASCADE' });
Parking.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Vehicle, { onUpdate: 'CASCADE' });
Vehicle.belongsTo(User, { foreignKey: 'userId' });

Parking.hasMany(ParkingSpot, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ParkingSpot.belongsTo(Parking, { foreignKey: 'parkingId' });

Vehicle.hasOne(Booking, { onUpdate: 'CASCADE' });
ParkingSpot.hasOne(Booking, { onUpdate: 'CASCADE' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicleId' });
Booking.belongsTo(ParkingSpot, { foreignKey: 'spotId' });

const syncronize = async () => {
  try {
    await sequelize.sync();
    console.log('Tables created successfully'.magenta);
  } catch (error) {
    console.log(`Error creating tables. ${error}`.blue.underline);
  }
};

export default syncronize;
