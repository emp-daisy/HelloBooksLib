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
}



export default AuthorController;
