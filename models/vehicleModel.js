import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Vehicle = sequelize.define('Vehicles', {
  vehicleId: {
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
  vehicleType: {
    type: DataTypes.ENUM,
    values: ['2 Wheeler', '3 Wheeler', '4 Wheeler', 'Heavy Vehicle'],
  },
  fuelType: {
    type: DataTypes.ENUM,
    values: ['Electric', 'Petrol', 'Diesel'],
  },
  image: {
    type: DataTypes.STRING,
  },
  numberPlate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Vehicle;
