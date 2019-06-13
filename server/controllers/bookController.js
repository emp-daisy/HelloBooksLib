/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import debug from 'debug';
import models from '../db/models';
import Utils from '../helpers/utilities';

const { Op } = sequelize;
const log = debug('dev');

class BookController {
  static async addBook(req, res) {
    const { title, description, amount, authorID, status, year, categoryID, isbn } = req.body;
    try {
      const book = await models.Books.create({
        title,
        description,
        categoryID,
        amount,
        authorID,
        status,
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
      const requestedBook = await models.RequestedBooks.create({
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

  static async lendBook(req, res) {
    const { isbn, patronId} = req.body;
    
    try {
      const booksNotReturned = await models.BorrowedBooks.findAndCountAll({ where: { patronId, returned : false } });

      if (booksNotReturned.count >= 3) {
        return Utils.errorStatus(res, 400, 'You cannot have more than 3 books in your possession');        
      } 
      const today = new Date();
      const overdueBook = booksNotReturned.rows.filter((book) => book.dueDate < today);
  
      if(overdueBook.length >= 1) {
        const dueBooks = overdueBook.map((book) =>`The book titled '${book.title.toUpperCase()}' was due for return on ${book.dueDate.toString().substring(0, 15)},`);
        const dueBookTwo = dueBooks[1] ? dueBooks[1] : '' ;
        const responseObj = {
          message: `${dueBooks[0]} ${dueBookTwo} Kindly return before we can proceed with a new request`
        }
        return Utils.errorStatus(res, 400, responseObj); 
      }

      const dateBorrowed = new Date();
      const dueDate = new Date();
      // Books are due for return after 3 days
      dueDate.setDate(dueDate.getDate() + 3); 
      const bookDetails = await models.Books.findOne({ where: { isbn }});
      const { title } = bookDetails.dataValues ;
      const borrowedBook = await models.BorrowedBooks.create({
        isbn,
        title,
        dateBorrowed,
        dueDate,
        patronId    
      });

      await models.Books.update({ status: 'borrowed' }, { where: { isbn } });

      return Utils.successStatus(res, 201, 'Success', borrowedBook);

    } catch (error) {
      Utils.errorStatus(res, 500, error.message);
    }
  }

  static async returnBook(req, res){
    const { isbn, patronId, damaged } = req.body;

    let fineCost = 0;
    let returnMessage = null;
    try {
      const borrowedBook = await models.BorrowedBooks.findOne({
        where: {
          [Op.and]: [{ isbn }, { patronId }]
        }
      });
      if(!borrowedBook){
        return Utils.errorStatus(res, 404, 'Book was not found');
      }
      const date = new Date()
      if(borrowedBook.dueDate < date) {
        const mulitpier = Math.round((date - borrowedBook.dueDate)/86400000);
        fineCost = 200 * mulitpier;
        await models.BorrowedBooks.update(
          { fineAmount: fineCost ,fineStatus: 'unpaid' },
          {
            where: {
              [Op.and]: [{ isbn }, { patronId }]
            }
          }
        )
        returnMessage = `Your due date is past you have Incured a fine of ${fineCost}`;
      }
      if(damaged === 'true') {
        fineCost += 100;
        await models.BorrowedBooks.update(
          { fineAmount: fineCost ,fineStatus: 'unpaid' },
          {
            where: {
              [Op.and]: [{ isbn }, { patronId }]
            }
          }
        )
        if(!returnMessage) {
          returnMessage = `You made damages to our book incuring a cost of ${fineCost}`;
        } else {
          returnMessage += ` and you also made damages to our book incuring a total cost of ${fineCost}`;
        }
      }
      if(returnMessage) {
        return Utils.errorStatus(res, 400, returnMessage)
      }

      await models.Books.update({ status: 'Available' }, { where: { isbn } });
      await models.BorrowedBooks.update({ returned: true }, { where: { isbn } });
      return Utils.successStatus(res, 200, 'Book successfully returned');

    } catch (error){
      Utils.errorStatus(res, 500, error.message);
    }

  }
}

export default BookController;
