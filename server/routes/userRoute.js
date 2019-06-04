import express from 'express';
import UserController from '../controllers/userController';
import Validate from '../middleware/validation';

const userRoute = express.Router();

userRoute.post('/signup', Validate.signup, UserController.signUp); 
userRoute.post('/signin', Validate.signin, UserController.emailSignin);
userRoute.get('/verifyEmail', UserController.verifyEmailLink);
userRoute.post('/passwordreset', UserController.initiateReset);
userRoute.get('/passwordreset/:id/:token', UserController.verifyResetLink);
userRoute.post('/resetpassword', UserController.resetPassword);

export default userRoute;
