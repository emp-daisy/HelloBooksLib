/* eslint-disable require-jsdoc */
/* eslint-disable class-methods-use-this */
import models from '../db/models';
import auth from '../helpers/auth'

const UserController = {
    async signUp(req, res) {
        models.User.findOne({
            where: { email: req.body.email }
          })
          .then((foundUser) => {
            if (foundUser) {
              return res.status(409).send({
               status: res.statusCode,
               message: 'email address exist already', 
              });
            }

            const hashPassword = auth.hashPassword(req.body.password);

            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashPassword,
              };

            const token = auth.generateToken(user);

              models.User.create(user).then((createdUser) => {
                return res.status(201).send({ 
                  status: res.statusCode,
                  message: 'User added successfully',
                  data: {
                      token,
                      id: createdUser.id,
                      firstName: createdUser.firstName,
                      lastName: createdUser.lastName,
                      email: createdUser.email,
                  },
                }); 
              })
              .catch((error) => {
                return res.status(500).json({
                    status: res.statusCode,
                    error: 'Internal error',
                  });
              });
            })
    },

    async signIn(req, res) {
      try {
        const { email, password } = req.body;
        const user = await models.User.findOne({ where: { email } });
        if (!user) {
          return res.status(404).json({
            status: res.statusCode,
            error: 'User not found!',
          });
        }

        const hashPassword = auth.hashPassword(req.body.password);
        const result = await auth.comparePassword(password, hashPassword)
        if (!result) {
          return res.status(401).json({
            status: res.statusCode,
            error: 'Incorrect password',
          });
        }

        const token = auth.generateToken(user);

        return res.status(201).send({ 
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