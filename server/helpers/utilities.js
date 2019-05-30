/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */

class Utilities {
  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
  */

  static errorstatus(res, statusCode, errorMessage) {
    return res.status(statusCode).json({
      status: statusCode,
      error: errorMessage,
    });
  }

  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} message - the appropraite message
  * @paramm {Object} data - the response data
  * @memberof Utilities
  */

  static successStatus(res, statusCode, message, data) {
    return res.status(statusCode).json({ status: statusCode, message, data});
  }
}

export default Utilities;
