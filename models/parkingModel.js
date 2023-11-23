import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Parking = sequelize.define('Parkings', {
  parkingId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalSlots: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  availableSlots: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pinCode: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lat: {
    type: DataTypes.DOUBLE,
    defaultValue: 18.516726,
  },
  long: {
    type: DataTypes.DOUBLE,
    defaultValue: 73.856255,
  },
});

export default Parking;
