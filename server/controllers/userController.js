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
    }
    
}


export default UserController;