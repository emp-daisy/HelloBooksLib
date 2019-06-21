import express from 'express';
import PaymentController from '../controllers/paymentController';
import Authenticate from '../middleware/authenticator';

const paymentRouter = express.Router();

paymentRouter.get('/subscribe', Authenticate.isLoggedIn, PaymentController.subscribe);
paymentRouter.post('/subscribe', PaymentController.verifyTransaction);

export default paymentRouter;
