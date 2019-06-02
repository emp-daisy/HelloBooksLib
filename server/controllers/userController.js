/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */
import sequelize from 'sequelize';
import models from '../db/models';
import auth from '../helpers/auth';
import util from '../helpers/utilities';
import mailer from '../helpers/mailer';
import Auth from '../app/helpers/auth';

const { Op } = sequelize;

class UserController {
  static async signUp(req, res) {
    try {
      const foundUser = await models.Users.findOne({
        where: { email: req.body.email }
      });
      if (foundUser) {
        return util.errorStatus(res, 409, 'email address exist already');
      }

      const hashPassword = auth.hashPassword(req.body.password);
      const mailToken = Auth.generateMailToken({
        firstName: req.body.firstName, 
        email: req.body.email,
        password: req.body.hashPassword
      });

      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        email_confirm_code: mailToken,
        signupMethod: 'local'
      };
      const token = auth.generateToken(user);
    
      const createdUser = await models.Users.create(user);
      const link = `https://helobooks.herokuapp.com/api/v1/auth/verifyEmail?token=${mailToken}`

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
      util.errorStatus(res, 500, error);
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
      util.errorstatus(res, 500, 'Internal server Error');
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
  
  static async verifyEmailLink(req, res) {
     try {
    const { mailToken } = req.query;
    const payload = Auth.verifyMailToken(mailToken);

    if(!payload) {
      return util.errorStatus(res, 400, 'Invalid Verification Link');

    }
      const { email } = payload;
   
      const updatedUserEmail = await models.Users.update(
      {email_confirm_code: null}, {where : {email}});

      //this should redirect the user to a page. but for test sakes, I will return a response.
      return util.successStatus(res, 200, 'Email verified successfully', updatedUserEmail)

    } catch(err) {
      return util.errorStatus(res, 500, err.message)
    }
  }
}

export default UserController;
