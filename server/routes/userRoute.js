import express from 'express';
import userController from '../controllers/userController';
import Validate from '../middlewares/signupValidation';

const userRoute = express.Router();

userRoute.post('/signup',Validate.signup, userController.signUp);

export default userRoute;
