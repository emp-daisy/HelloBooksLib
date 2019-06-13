/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../db/models';
import auth from '../helpers/auth';
import util from '../helpers/utilities';
import mailer from '../helpers/mailer';


const { Op } = sequelize;
const url = process.env.APP_URL;
dotenv.config();

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
        role: 'user',
        signupMethod: 'local'
      };

      const createdUser = await models.Users.create(user);
      const token = auth.generateToken({ id: createdUser.id, firstName, lastName, email });
      const link = `${url}/auth/verifyemail?token=${mailToken}&id=${createdUser.id}`;
      mailer.sendWelcomeMail(user.email, user.firstName, link);

      return util.successStatus(res, 201, 'User Created successfully', {
        token,
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        signupMethod: 'local',
        mailToken
      });
    } catch (error) {
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

      const {id, firstName, lastName, email: emailAddress, role} = user.dataValues;
      const token = auth.generateToken({ id, firstName, lastName, email: emailAddress, role });

      return util.successStatus(res, 200, 'Login successful', {
        token,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

    } catch (error) {
      util.errorStatus(res, 500, 'Internal server Error');
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
          role: 'user',
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
      const { token, id } = req.query;
      const errArr = [];
      let errMessage;
        if(!token) {
            errArr.push('token');
           }
        if(!id){
            errArr.push('id');
           }
        if(errArr.length > 0) {
            if(errArr.length < 2) {
              errMessage = errArr.join('');
              return util.errorStatus(res, 401, `${errMessage} must be defined`);
             }
              errMessage = errArr.join(' and ');
              return util.errorStatus(res, 401, `${errMessage} must be defined`);
          }

      const user = await models.Users.findByPk(id);
      if(!user) return util.errorStatus(res, 401, 'Invalid verification link');
      const { email_confirm_code, email } = user;

      if (email_confirm_code === null) return util.errorStatus(res, 403, 'Email already verified');

      if(email_confirm_code !== token) {
          return util.errorStatus(res, 401, 'Invalid verification link');
      }
      await models.Users.update({ email_confirm_code: null },{ where: { email } });
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
    const link = `${url}/auth/passwordreset/${payload.id}/${token}`;

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

    const errorChecker = jwt.verify(token, user.password, err => {
      if (err) return true;
      return false;
    });
    if (errorChecker) return util.errorStatus(res, 401, 'Invalid password reset link');
    const link = `${url}/auth/resetpassword`
    return res.render('reset_form', {id, token, link, name: user.firstName});
  }

  static async resetPassword(req, res) {
    const { id, token, password } = req.body;
    const user = await models.Users.findByPk(id);
    if (!user) return util.errorStatus(res, 401, 'Invalid password reset link');

    const errorChecker = jwt.verify(token, user.password, err => {
      if (err) return true;
      return false;
    });
    if (errorChecker) return util.errorStatus(res, 401, 'Invalid password reset link');

    models.Users.update(
      { password: auth.hashPassword(password) },
      { where: { id } }
    );
    return util.successStatus(res, 200, 'Password reset successfully');
  }

  static async assignUserRole(req, res) {
    const { email, role } = req.body;
    try {
        const user = await models.Users.findOne({where: {email}});

        if(!user) return util.errorStatus(res, 404, 'User does not exists');

        const roleSpec = ['admin', 'user', 'super_admin'];

        if(!roleSpec.includes(role)) return util.errorStatus(res, 404, 'Role type not found')

        await models.Users.update({ role }, {where: { email } });
        const updatedUser = await models.Users.findOne({where: { email }})

        return util.successStatus(res, 200, 'Role Assigned successfully', {
          assignedBy: req.loggedinUser.firstName,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email:  user.email,
          role: updatedUser.role
        })
    } catch(err) {
        return util.errorStatus(res, 500, err.message);
    }
  }

  static async getUserDetails(req, res) {
    const { userId } = req.query;
    let theUser;

    try {
      if (userId) {
        theUser = await models.Users.findByPk(userId, {
          attributes: ['id', 'firstName', 'lastName', 'email', 'signupMethod', 'role']
        });

        if (!theUser) {
          return util.errorStatus(res, 404, 'User not found');
        }
      } else {
        theUser = await models.Users.findAll({
          attributes: ['id', 'firstName', 'lastName', 'email', 'signupMethod', 'role']
        });
      }
    } catch (error) {
      return util.errorStatus(res, 500, 'Internal Server Error');
    }

    return util.successStatus(res, 200, 'data', theUser);
  }

  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const theUser = await models.Users.findByPk(id);
      if (!theUser) {
        return util.errorStatus(res, 404, 'User not found');
      }
      await models.Users.destroy({ where: { id } });
    } catch (error) {
      return util.errorStatus(res, 500, 'Internal Server Error');
    }

    return util.successStatus(res, 200, 'User deleted Successfully');
  }

  static async createUser(req, res) {
    const { firstName, lastName, email } = req.body;
    const { role } = req.params;
    const password = await util.generatePassword();
    try {
      const foundUser = await models.Users.findOne({ where: { email } });

      if (foundUser) {
        return util.errorStatus(res, 409, 'email address exists already');
      }

      const hashPassword = auth.hashPassword(password);
      const user = {
        firstName,
        lastName,
        email,
        password: hashPassword,
        signupMethod: 'local',
        role
      };

      const createdUser = await models.Users.create(user);
      const token = auth.generateToken({
        id: createdUser.id
      });

      mailer.sendAdminMail(user.email, user.firstName, password);

      return util.successStatus(res, 201, 'User Created successfully', {
        token,
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role
      });
    } catch (error) {
      util.errorStatus(res, 500, error.name);
    }
  }
}

export default UserController;
