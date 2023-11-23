import express from 'express';
import {
  getAllUsers,
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserById,
} from '../controllers/userController.js';
import {
  verifyUser,
  verifyAdmin,
  facebookAuthenticate,
  facebookCallbackAuthenticate,
  googleAuthenticate,
  googleCallbackAuthenticate,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(verifyUser, verifyAdmin, getAllUsers);

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/auth/facebook').get(facebookAuthenticate);
router.route('/auth/facebook/callback').get(facebookCallbackAuthenticate);
router.route('/auth/google').get(googleAuthenticate);
router.route('/auth/google/callback').get(googleCallbackAuthenticate);

router
  .route('/profile')
  .get(verifyUser, getUserProfile)
  .put(verifyUser, updateUserProfile);

// Admin routes
router
  .route('/:userId')
  .get(verifyUser, verifyAdmin, getUserById)
  .delete(verifyUser, verifyAdmin, deleteUser);

export default router;
