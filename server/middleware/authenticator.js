/* eslint-disable require-jsdoc */
import passport from 'passport';
import util from '../helpers/utilities';
// eslint-disable-next-line no-unused-vars
import passportconfig from '../helpers/passport';
import Auth from '../helpers/auth'

class Authenticate {
  static googleLogin(req, res, next) {
    passport.authenticate('googleLogin', (err, user, info) => {
      if (info || err || !user) {
        return util.errorStatus(res, 401, 'Unauthorized');
      }
      req.userProfile = user;
      next();
    })(req, res, next);
  }

  static facebookLogin(req, res, next) {
    passport.authenticate('facebookLogin', (err, user, info) => {
      if (info || err || !user) {
        return util.errorStatus(res, 401, 'Unauthorized');
      }
      req.userProfile = user;
      next();
    })(req, res, next);
  }

  static isloggedIn(req, res, next) {
    if (!req.headers.authorization) {
      return util.errorStatus(res, 403, 'Authentication is required');
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = Auth.verifyToken(token);
      req.user = decode;

      return next();
    } catch (error) {
      return util.errorStatus(res, 401, 'Unauthorized');
    }
  }
}

export default Authenticate;
