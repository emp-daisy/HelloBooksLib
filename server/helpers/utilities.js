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
      error: errorMessage
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
    return res.status(statusCode).json({ status: statusCode, message, data });
  }

  /**
   * @static
   * @description Check if data exist in database
   * @param {integer} key - the table's id to be checked against in database
   * @param {table} model - the table name
   * @returns {boolean / dataValue} returns dataValue or false
   * @memberof Utilities
   */

  static async exits(key, model) {
    const exists = await models[model].findOne({ where: { id: key } });

    if (exists) {
      return exists.dataValues;
    }

    return false;
  }

  /**
   * @static
   * @description Check if author exist in database
   * @param {integer} authorID - the author's id to be checked in database
   * @returns {boolean} returns true or false
   * @memberof Utilities
   */

  static async checkAuthorID(authorID) {
    const author = await models.Authors.findOne({ where: { id: authorID } });
    return author;
  }

  /**
   * @static
   * @description Check if author exist in database
   * @param {integer} authorID - the author's id to be checked in database
   * @returns {boolean} returns true or false
   * @memberof Utilities
   */

  static async generatePassword() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export default Utilities;
