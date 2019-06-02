import express from 'express';
import UserController from '../controllers/userController';

const userRoute = express.Router();

userRoute.post('/signup', UserController.signUp);

userRoute.get('/verifyEmail', 
				UserController.verifyEmailLink);


export default userRoute;
