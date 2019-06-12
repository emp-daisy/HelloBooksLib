/* eslint-disable require-jsdoc */
import passport from 'passport';
import util from '../helpers/utilities';
// eslint-disable-next-line no-unused-vars
import passportconfig from '../helpers/passport';
import Auth from '../helpers/auth'
import models from '../db/models';

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
    let token = req.headers.authorization;
    if(token.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    try {
      const decode = Auth.verifyToken(token);
      if(!decode) return util.errorStatus(res, 401, 'Unauthorized');
      req.user = decode;

      return next();
    } catch (error) {
      return util.errorStatus(res, 401, 'Unauthorized');
    }
  }

  static async isSuperAdmin(req, res, next) {
    const { user } = req;
    
    const foundUser = await models.Users.findOne({where: {email: user.email}})

    if(!foundUser) return util.errorStatus(res, 401, 'Unauthorized');

    if(foundUser.role !== 'super_admin') return util.errorStatus(res, 401, 'Unauthorized');

    return next();
  }

  static async isAdmin(req, res, next) {
    const { user } = req;

    if(user.role !== 'admin' && user.role !== 'super_admin') {
      return util.errorStatus(res, 401, 'Unauthorized');
    }

    return next();
  }
}

export default Authenticate;
