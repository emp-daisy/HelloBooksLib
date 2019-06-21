/* eslint-disable default-case */
/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import paystack from 'paystack';
import { config } from 'dotenv';
import models from '../db/models';
import PaymentHander from '../helpers/payments';
import Utils from '../helpers/utilities';

config();
const Paystack = paystack(process.env.PAYSTACK_SECRET_KEY);

class PaymentController {
  static async subscribe(req, res) {
    const { email } = req.loggedinUser
    return PaymentHander.initiatePayment(res, { email, });
  }

  static async verifyTransaction(req, res) {
    const response = await Paystack.transaction.verify(req.body.reference);
    const { plan, customer } = response.data;
    await models.Users.update(
      {
        subscriptions: sequelize.fn(
          'array_append',
          sequelize.col('subscriptions'),
          plan
        )
      },
      { where: { email: customer.email } }
    );

    return Utils.successStatus(res, 200, 'Payment Successful');
  }
}

export default PaymentController;
