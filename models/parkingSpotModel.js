import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ParkingSpot = sequelize.define('ParkingSpots', {
  spotId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  parkingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  spotNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  spotType: {
    type: DataTypes.ENUM,
    values: ['2 Wheeler', '3 Wheeler', '4 Wheeler', 'Heavy Vehicle'],
  },
  fuelType: {
    type: DataTypes.ENUM,
    values: ['Electric', 'Petrol', 'Diesel'],
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['available', 'booked'],
  },
});

export default ParkingSpot;
