import express from 'express';
import userController from '../controllers/userController';
import signupValidate from '../middlewares/signupValidation';

const userRoute = express.Router();

userRoute.post('/signup',signupValidate, userController.signUp);

export default userRoute;
