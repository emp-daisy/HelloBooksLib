/* eslint-disable require-jsdoc */
import models from '../db/models';
import Utils from '../helpers/utilities';


class BookController {
  static async addBook(req, res) {
    const {
      title,
      description,
      amount,
      authorID,
      status,
      year
    } = req.body;
    try {
      const book = await models.Books.create({
        title,
        description,
        amount,
        authorID,
        status,
        year,
      });

      return Utils.successStatus(res, 201, 'Book added successfully', {
        id: book.id,
        title: book.title,
        description: book.description,
        amount: book.amount,
        year: book.year,
        authorID: book.authorID,
        status: book.status,
      });
    } catch (error) {
      Utils.errorStatus(res, 500, error.message);
    }
  }
}

export default BookController;
