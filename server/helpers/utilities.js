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
  * @description Check if data exist in database
  * @param {integer} key - the table's id to be checked against in database
  * @param {table} model - the table name
  * @returns {boolean / dataValue} returns dataValue or false
  * @memberof Utilities
  */

  static async isExist(key, model) {
    const isExist = await models[model].findOne( { where: { id : key} });

    if(isExist) {
      return isExist.dataValues;
    }

    return false;
  }
}

export default Utilities;
