import express from 'express';
import UserController from '../controllers/userController';

const userRoute = express.Router();

userRoute.post('/signup', UserController.signUp);
userRoute.get('/verifyEmail', UserController.verifyEmailLink);
userRoute.post('/passwordreset', UserController.initiateReset);
userRoute.get('/passwordreset/:id/:token', UserController.verifyResetLink);
userRoute.post('/resetpassword', UserController.resetPassword);

export default userRoute;
