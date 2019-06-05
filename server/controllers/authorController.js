/* eslint-disable require-jsdoc */
import models from '../db/models';
import util from '../helpers/utilities';

class AuthorController {
  static async addAuthor(req, res) {
    const { firstName, lastName } = req.body;
    try {
      const author = await models.Authors.create({
        firstName,
        lastName
      });

      return util.successStatus(res, 201, 'Author added successfully', {
        authorId: author.id,
        firstName: author.firstName,
        lastName: author.lastName
      });
    } catch (error) {
      util.errorStatus(res, 500, error.name);
    }
  }
  
  static async fetchAllAuthors(req, res) {
    try {
      const authors = await models.Authors.findAll();
      return util.successStatus(res, 200, 'data fetched', {
        authors,
      });

    } catch (error) {
      util.errorStatus(res, 500, error.name);
    }
  }
}



export default AuthorController;
