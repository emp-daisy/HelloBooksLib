/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
import models from '../db/models';

class Utilities {
  /**
  * @static
  * @description Returns message based on the status
  * @param {Object} res - Response object
  * @param {integer} statusCode - status code to be sent
  * @param {string} errorMessage - the appropraite error message
  * @memberof Utilities
  */

  static errorStatus(res, statusCode, errorMessage) {
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

   /**
  * @static
  * @description Check if author exist in database
  * @param {integer} authorID - the author's id to be checked in database
  * @returns {boolean} returns true or false
  * @memberof Utilities
  */

  static async checkAuthorID(authorID) {
    const author = await models.Authors.findOne( { where: { id : authorID} });
    return author;
  }
}

export default Utilities;
