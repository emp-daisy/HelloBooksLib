import express from 'express';
import UserController from '../controllers/userController';
import authenticate from '../middleware/authenticator';

const socialRoute = express.Router();

socialRoute.post(
  '/google',
  authenticate.googleLogin,
  UserController.socialSignin
);
socialRoute.post(
  '/facebook',
  authenticate.facebookLogin,
  UserController.socialSignin
);

export default socialRoute;
