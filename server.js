import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import { connectDB } from './config/db.js';
import syncronize from './config/syncronization.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import parkingRoutes from './routes/parkingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import otpRoutes from './routes/otpRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
syncronize();

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(passport.initialize());

app.use('/api/users', userRoutes);
app.use('/api/parkings', parkingRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/otp', otpRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
);
