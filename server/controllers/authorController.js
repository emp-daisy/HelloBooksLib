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

      const authorObj = {};
      authorObj.authorId = author.id;
      authorObj.firstName = author.firstName;
      // Get middleName only when author has one
      if(author.middleName.length >= 1) {
        authorObj.middleName = author.middleName;
      }      
      authorObj.lastName = author.lastName;

      return util.successStatus(res, 201, 'Author added successfully', authorObj);
    } catch (error) {
      util.errorStatus(res, 500, error.name);
    }
  }
}

export default AuthorController;
