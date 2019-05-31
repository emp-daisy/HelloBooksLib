import express from 'express';
import userController from '../controllers/userController';
import Validate from '../middleware/validation';

const userRoute = express.Router();

userRoute.post('/signup', userController.signUp);

userRoute.post('/signin', Validate.signin, userController.emailSignin);

export default userRoute;
