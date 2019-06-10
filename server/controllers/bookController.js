/* eslint-disable require-jsdoc */
import debug from 'debug';
import models from '../db/models';
import Utils from '../helpers/utilities';

const log = debug('dev');

class BookController {
  static async addBook(req, res) {
    const { title, description, amount, authorID, active, year, categoryID, isbn } = req.body;
    try {
      const book = await models.Books.create({
        title,
        description,
        categoryID,
        amount,
        authorID,
        active,
        year,
        isbn
      });
      return Utils.successStatus(res, 201, 'Book added successfully', book);
    } catch (error) {
      Utils.errorStatus(res, 500, error.message);
    }
  }

  static async getAllBooks(req, res) {
    if (req.query.page) {
      let { page, limit } = req.query;
      page = parseInt(page, 10);
      page = page > 0 ? page : 1;
      limit = parseInt(limit, 10);
      limit = limit > 0 ? limit : 50;
      const offset = (page - 1) * limit;
      try {
        const books = await models.Books.findAndCountAll({
          limit,
          offset,
          $sort: { id: 1 }
        });
        const pages = Math.ceil(books.count / limit);
        const data = books.rows;
        return res.status(200).json({
          status: res.status,
          message: 'success',
          pages,
          data
        });
      } catch (error) {
        log(error.message);
        Utils.errorStatus(res, 500, error.message);
      }
    } else {
      return Utils.successStatus(res, 200, 'Books fetched successfully', await models.Books.findAll());
    }
  }

  static async getSpecificBook(req, res) {
    const book = await models.Books.findByPk(req.params.id);
    if(!book) return Utils.errorStatus(res, 404, 'Book with the specified ID not found');

    return Utils.successStatus(res,
      200,
      'Book fetched successfully',
      book
    );
  }

  static async deleteBook(req, res) {
    const book = await models.Books.destroy({ where: { id: req.params.id }});
    if(!book) return Utils.errorStatus(res, 404, 'Book with the specified ID not found');

    return Utils.successStatus(res, 200, 'Book deleted successfully', {});
  }

  static async requestBook(req, res) {
    const { title, description, author, year, categoryID, userID} = req.body;
    try {
      const requestedBook = await models.Requested_Books.create({
        title,
        description,
        author,
        year,
        categoryID,
        userID
      });
      return Utils.successStatus(res, 201, 'Book requested successfully', requestedBook);
    } catch (error) {
      Utils.errorStatus(res, 500, error.message);
    }
  }
}

export default BookController;
