/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import models from '../db/models';
import util from '../helpers/utilities';
import Author from '../models/authorModel';

class AuthorController {
  static async addAuthor(req, res) {
    const { firstName, middleName, lastName } = req.body;
    const author = await models.Authors.create({
      firstName,
      middleName,
      lastName
    });

    const authorObj = new Author(author);

    return util.successStatus(res, 201, 'Author added successfully', authorObj);
  }

  static async getAuthor(req, res) {
    const authorId = req.params.id;
    const author = await models.Authors.findByPk(authorId);
    if (!author) return util.errorStatus(res, 404, 'Author not found');

    const authorObj = new Author(author);

    return util.successStatus(res, 200, 'Author found', authorObj);
  }

  static async updateAuthor(req, res) {
    const authorId = req.params.id;
    const foundAuthor = await models.Authors.findByPk(authorId);
    if (!foundAuthor) return util.errorStatus(res, 404, 'Author not found');

    const { firstName, middleName, lastName } = req.body;

    const response = await models.Authors.update(
        { firstName, middleName, lastName }, 
        { where: { id: authorId }, 
        returning: true }
      );

    const author = response[1][0];
    const authorObj = new Author(author);

    return util.successStatus(res, 200, 'Author updated successfully', authorObj);
  }
  
  static async listAuthor(req, res) {
    const result = await models.Authors.findAll();

    return util.successStatus(res, 200, 'Authors retrieved successfully', result)
  }

  static async deleteAuthor(req, res) {
    const deleteAuthor = await models.Authors.destroy({where: {id: req.params.id}})

    if (!deleteAuthor) {
      return util.errorStatus(res, 404, 'The author specified does not exist');
    }
    
    return util.successStatus(res, 200, 'Author deleted successfully');
  }

  static async favouriteAnAuthor(req, res) {
    const { id } = req.params;
    const { loggedinUser } = req;

    const requestedAuthor = await models.Authors.findByPk(id, {
      attributes: ['firstName', 'lastName']
    });

    if (!requestedAuthor) {
      return util.errorStatus(res, 400, 'The requested Author is not available');
    }

    const { firstName, lastName } = requestedAuthor;

    if (loggedinUser.favouriteAuthors) {
      const alreadyfavourite = loggedinUser.favouriteAuthors.find(
        author => author === Number(id)
      );
      if (alreadyfavourite) {
        return util.successStatus(
          res,
          200,
          `Author ${firstName} ${lastName}, has already been added to favourite Authors`
        );
      }
    }

    await models.Users.update(
      {
        favouriteAuthors: sequelize.fn(
          'array_append',
          sequelize.col('favouriteAuthors'),
          Number(id)
        )
      },
      { where: { id: loggedinUser.id } }
    );

    return util.successStatus(
      res,
      200,
      `Author ${firstName} ${lastName}, has been added to favourite Authors`
    );
  }
}

export default AuthorController;
