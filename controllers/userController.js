import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import passport from 'passport';

// syncronizeUser();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, isAdmin } = req.body;

  const userExists = await User.findOne({ where: { email: email } });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists!!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    mobile: mobile,
    isAdmin: isAdmin,
  });

  if (user) {
    res.json({
      id: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      lat: user.lat,
      long: user.long,
      token: generateToken(user.userId),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    res.json({
      id: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      lat: user.lat,
      long: user.long,
      token: generateToken(user.userId),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Credentials');
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { userId: req.user.userId } });

  if (user) {
    res.json({
      id: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { userId: req.user.userId } });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.image = req.body.image || user.image;
    user.lat = req.body.lat || user.lat;
    user.long = req.body.long || user.long;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(201);
    res.json({
      id: updatedUser.userId,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
      lat: updatedUser.lat,
      long: updatedUser.long,
      token: generateToken(updatedUser.userId),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { userId: req.params.userId } });

  if (user) {
    await user.destroy();
    res.json({ message: 'User Removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findOne({ where: { userId: req.params.userId } });
  if (user) {
    res.json({
      id: user.userId,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
    });
  }
});

export {
  getAllUsers,
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
};
