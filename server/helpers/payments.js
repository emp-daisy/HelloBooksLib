/* eslint-disable require-jsdoc */

class PaymentHandler {
  static async initiatePayment(res, details) {
    const { email } = details;
    return res.status(200).render('paystack', { email });
  }
}

export default PaymentHandler;
