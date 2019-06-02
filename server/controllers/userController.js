/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */
import sequelize from 'sequelize';
import models from '../db/models';
import auth from '../helpers/auth';
import util from '../helpers/utilities';

const { Op } = sequelize;

class UserController {
  static async signUp(req, res) {
    try {
      const foundUser = await models.Users.findOne({
        where: { email: req.body.email }
      });
      if (foundUser) {
        return util.errorstatus(res, 409, 'email address exist already');
      }

      const hashPassword = auth.hashPassword(req.body.password);

      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        signupMethod: 'local'
      };

      const token = auth.generateToken(user);

      const createdUser = await models.Users.create(user);
      return util.successStatus(res, 201, 'User added successfully', {
        token,
        id: createdUser.id,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email
      });
    } catch (error) {
      util.errorstatus(res, 500, error);
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
      if (!user) {
        return res.status(404).json({
          status: res.statusCode,
          error: 'User not found!',
        });
      }

      const result = await auth.comparePassword(password, user.password);

      if (!result) {
        return res.status(403).json({
          status: res.statusCode,
          error: 'Incorrect password!',
        });
      }

      const token = auth.generateToken(user.dataValues);

      return res.status(200).send({
        status: res.statusCode,
        message: 'Login successful!',
        data: {
          token,
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      });

    } catch (err) {
      return res.status(500).json({
        status: res.statusCode,
        error: err.message
      });
    }
  }
}

export default UserController;
