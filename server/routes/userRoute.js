import express from 'express';
import userController from '../controllers/userController';

const userRoute = express.Router();

userRoute.post('/signup', userController.signUp);

userRoute.post('/signin', userController.signIn);

export default userRoute;
