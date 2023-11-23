import { DataTypes, QueryTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Booking = sequelize.define('Bookings', {
  bookingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  vehicleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  spotId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  tax: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
});

export default Booking;

//Example.
