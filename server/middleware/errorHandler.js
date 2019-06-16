/**
 * @exports ErrorHandler
 * @class ErrorHandler
 */
class ErrorHandler {
  /**
       * @description Handles  uncaught erros in the app
       * @method sendError
       * @param {object} err
       * @param {object} req
       * @param {object} res
       * @param {function} next
       * @returns {(function|object)} Function next() or JSON API response
       */
  static sendError(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || 500).json({
      status: res.statusCode,
      error: err.message,
    });
  }
}

export default ErrorHandler;
