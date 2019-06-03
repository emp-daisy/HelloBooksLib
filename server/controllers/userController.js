/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import models from '../db/models';
import auth from '../helpers/auth';
import util from '../helpers/utilities';
import mailer from '../helpers/mailer';

const { Op } = sequelize;

class UserController {
  static async signUp(req, res) {
    const { firstName, lastName, email, password } = req.body;
    try {
      const foundUser = await models.Users.findOne({ where: { email } });

      if (foundUser) return util.errorStatus(res, 409, 'email address exists already');

      const hashPassword = auth.hashPassword(password);
      const mailToken = auth.generateMailToken({ firstName, email });
      const user = {
        firstName,
        lastName,
        email,
        password: hashPassword,
        email_confirm_code: mailToken,
        signupMethod: 'local'
      };

      const createdUser = await models.Users.create(user);
      const token = auth.generateToken({ id: createdUser.id, firstName, lastName, email });
      const link = `https://helobooks.herokuapp.com/api/v1/auth/verifyEmail?token=${mailToken}`;

      mailer.sendWelcomeMail(user.email, user.firstName, link);

      return util.successStatus(res, 201, 'User Created successfully', {
        token,
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        signupMethod: 'local'
      });
    } catch (error) {
      console.log(error);
      util.errorStatus(res, 500, error.name);
    }
  }

  static async emailSignin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await models.Users.findOne({ where: { email } });
      if (!user) return util.errorStatus(res, 401, 'Incorrect Login information');
     
      const result = await auth.comparePassword(password, user.password);

      if (!result) return util.errorStatus(res, 401, 'Incorrect Login information');
 
      const token = auth.generateToken(user.dataValues);

      return util.successStatus(res, 200, 'Login successful', {
        token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

    } catch (error) {
      util.errorStatus(res, 500, 'Internal server Error');;
    }
  }
  
  static async socialSignin(req, res) {
    let user;
    try {
      const { userProfile } = req;

      const existingUser = await models.Users.findOne({
        where: {
          [Op.or]: [
            { email: userProfile.emails[0].value },
            { socialId: userProfile.id }
          ]
        }
      });

      if (existingUser) {
        user = existingUser.dataValues;
      } else {
        const newUser = {
          signupMethod: userProfile.method,
          socialId: userProfile.id,
          email: userProfile.emails[0].value,
          firstName: userProfile.name.familyName,
          lastName: userProfile.name.givenName,
          profilePic: userProfile.photos[0].value
        };
        user = await models.Users.create(newUser);
      }
    } catch (error) {
      util.errorStatus(res, 500, 'Internal server Error');
    }
    const token = auth.generateToken({ id: user.id });

    return util.successStatus(res, 200, 'Login successful', {
      token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      signupMethod: user.signupMethod
    });
  }

  static async verifyEmailLink(req, res) {
    try {
      const { token } = req.query;
      const payload = auth.verifyMailToken(token);

      if (!payload) return util.errorStatus(res, 400, 'Invalid Verification Link');

      const { email } = payload;

      models.Users.update({ email_confirm_code: null },{ where: { email } });

      // this should redirect the user to a page. but for test sakes, I will return a response.
      return util.successStatus(res, 200, 'Email verified successfully');
    } catch (err) {
      return util.errorStatus(res, 500, err.message);
    }
  }

  static async initiateReset(req, res) {
    const { email } = req.body;
    const user = await models.Users.findOne({ where: { email } });
    if (!user) {
      return util.errorStatus(
        res,
        401,
        'The email you entered did not match our records. Please double-check and try again.'
      );
    }
    const payload = { id: user.id, email };
    const secret = user.password;
    const token = auth.getOneTimeToken(payload, secret);
    const link = `https://helobooks.herokuapp.com/api/v1/auth/passwordreset/${payload.id}/${token}`;

    mailer.initiateResetMail(user.email, user.firstName, link);
    return util.successStatus(
      res,
      200,
      'A password reset link has been sent to your email'
    );
  }

  static async verifyResetLink(req, res) {
    const { id, token } = req.params;
    const user = await models.Users.findByPk(id);
    if (!user) return util.errorStatus(res, 401, 'Invalid password reset link');
    jwt.verify(token, user.password, err => {
      if (err) return util.errorStatus(res, 401, 'Invalid password reset link');
    });

    mailer.sendResetMail(user.email, id, token);
    return util.successStatus(
      res,
      200,
      'Kindly check your email to complete the reset process'
    );
  }

  static async resetPassword(req, res) {
    const { id, token, password } = req.body;
    const user = await models.Users.findByPk(id);
    if (!user) return util.errorStatus(res, 401, 'Invalid password reset link');

    jwt.verify(token, user.password, err => {
      if (err) return util.errorStatus(res, 401, 'Invalid password reset link');
    });

    models.Users.update(
      { password: auth.hashPassword(password) },
      { where: { id } }
    );
    return util.successStatus(res, 200, 'Password reset successfully');
  }
}

export default UserController;
