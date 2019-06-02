/* eslint-disable require-jsdoc */
import passport from 'passport';
import util from '../helpers/utilities';
// eslint-disable-next-line no-unused-vars
import passportconfig from '../helpers/passport';

class Authenticate {
  static authToken(req, res, next) {
    passport.authenticate('jwt', (err, user, info) => {
      if (info || err || !user) {
        return util.errorstatus(res, 401, 'Unauthorized');
      }
      req.user = user.dataValues;
      next();
    })(req, res, next);
  }

  static googleLogin(req, res, next) {
    passport.authenticate('googleLogin', (err, user, info) => {
      if (info || err || !user) {
        return util.errorstatus(res, 401, 'Unauthorized');
      }
      req.userProfile = user;
      next();
    })(req, res, next);
  }

  static facebookLogin(req, res, next) {
    passport.authenticate('facebookLogin', (err, user, info) => {
      if (info || err || !user) {
        return util.errorstatus(res, 401, 'Unauthorized');
      }
      req.userProfile = user;
      next();
    })(req, res, next);
  }
}

export default Authenticate;
