import express from 'express';
import userController from '../controllers/userController';
import Validate from '../middleware/validation';

const userRoute = express.Router();

userRoute.post('/signup', userController.signUp);

<<<<<<< HEAD
userRoute.post('/signin', Validate.signin, userController.emailSignin);
=======
userRoute.post('/signin', userController.signIn);
>>>>>>> 9b30c55f11b3294a8025cd2e25d10b8f9c6a31bf

export default userRoute;
