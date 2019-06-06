/* eslint-disable require-jsdoc */
import models from '../db/models';
import util from '../helpers/utilities';

class AuthorController {
  static async addAuthor(req, res) {
    const { firstName, middleName, lastName } = req.body;
    try {
      const author = await models.Authors.create({
        firstName,
        middleName,
        lastName
      });

      const authorObj = {
        authorId: author.id,
        firstName: author.firstName,
        middleName: author.middleName ? author.middleName : undefined,
        lastName: author.lastName,
      };

      return util.successStatus(res, 201, 'Author added successfully', authorObj);
    } catch (error) {
      util.errorStatus(res, 500, error.name);
    }
  }

  static async getAuthor(req, res) {
    try {
      const authorId = req.params.id;
      const author = await models.Authors.findByPk(authorId);
      if (!author) return util.errorStatus(res, 404, 'Author not found');

      return util.successStatus(res, 200, 'Author found', author);
    }catch(error) {
      util.errorStatus(res, 500, error.name);
    }
  }
}

export default AuthorController;
