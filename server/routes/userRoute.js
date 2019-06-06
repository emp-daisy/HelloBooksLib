import express from 'express';
import UserController from '../controllers/userController';
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const userRoute = express.Router();

userRoute.post(
  '/signup',
  Validate.signup,
  Validate.password,
  UserController.signUp
);
userRoute.post('/signin', Validate.signin, UserController.emailSignin);
userRoute.get('/verifyemail', UserController.verifyEmailLink);
userRoute.post('/passwordreset', UserController.initiateReset);
userRoute.get('/passwordreset/:id/:token', UserController.verifyResetLink);
userRoute.post(
  '/assignrole',
  Authenticate.user,
  Authenticate.isSuperAdmin,
  Validate.assignrole,
  UserController.assignUserRole
);
userRoute.post(
  '/resetpassword',
  Validate.resetPassword,
  UserController.resetPassword
);
userRoute.post(
  '/users/:role',
  Authenticate.user,
  Authenticate.isSuperAdmin,
  Validate.signup,
  Validate.role,
  UserController.createUser
);
userRoute.delete(
  '/user/:id',
  Authenticate.user,
  Validate.id,
  Authenticate.isSuperAdmin,
  UserController.deleteUser
);
userRoute.get(
  '/getusers',
  Authenticate.user,
  Validate.userId,
  Authenticate.isSuperAdmin,
  UserController.getUserDetails
);

export default userRoute;
