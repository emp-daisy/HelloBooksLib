/* eslint-disable prefer-const */
/* eslint-disable require-jsdoc */
import sequelize from 'sequelize';
import models from '../db/models';
import Utils from '../helpers/utilities';

const { Op } = sequelize;

class BookController {
  static async addBook(req, res) {
    const { title, description, tags, amount, authorID, status, year, categoryID, isbn } = req.body;
      const book = await models.Books.create({
        title,
        description,
        tags,
        categoryID,
        amount,
        authorID,
        status,
        year,
        isbn
      });
      return Utils.successStatus(res, 201, 'Book added successfully', book);
    }

    static async getAllBooks(req, res) {
      if (Object.keys(req.query).length !== 0) {        
        let { page, limit, searchBook } = req.query;
        page = parseInt(page, 10);
        page = page > 0 ? page : 1;
        limit = parseInt(limit, 10);
        limit = limit > 0 ? limit : 50;
        const offset = (page - 1) * limit;
        const searchQuery = searchBook ? {
          include: [{
            model: models.Authors,
            as: 'Author',
            where: {
              [Op.or]: [
                {firstName: {[Op.like]: `%${req.query.searchBook}%`}},
                {middleName: {[Op.like]: `%${req.query.searchBook}%`}},
                {lastName: {[Op.like]: `%${req.query.searchBook}%`}},
                {'$Books.title$': {[Op.like]: `%${req.query.searchBook}%`}},
                {'$Books.description$': {[Op.like]: `%${req.query.searchBook}%`}},
                {'$Books.tags$': {[Op.like]: `%${req.query.searchBook}%`}},
              ]
             }
        }]
        } : {};
  
  
          const searchResult = await models.Books.findAndCountAll({
            limit,
            offset,
            $sort: { id: 1 },
            ...searchQuery
        });
        
          if (searchResult.count === 0) {
          return Utils.errorStatus(res, 404, 'No record found')
        }
            return res.status(200).json({
                status: res.status,
                message: 'Books fetched successfully',
                page,
                pages: Math.ceil(searchResult.count / limit),
                searchResult: searchResult.rows
              });
          }
      
  
        return Utils.successStatus(res, 200, 'Books fetched successfully', await models.Books.findAll());
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

    return Utils.successStatus(res, 200, 'Book deleted successfully');
  }

  static async requestBook(req, res) {
    const { title, description, tags, author, year, categoryID, userID} = req.body;
      const requestedBook = await models.RequestedBooks.create({
        title,
        description,
        tags,
        author,
        year,
        categoryID,
        userID
      });
      return Utils.successStatus(res, 201, 'Book requested successfully', requestedBook);
  }

  static async lendBook(req, res) {
    const { isbn, patronId} = req.body;
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
  }

  static async extendDueDate(req, res) {
    const { id } = req.params;
    const { date } = req.body;
    const book = await models.BorrowedBooks.findByPk(id);

    if(req.loggedinUser.id !== book.patronId) {
      return Utils.errorStatus(res, 400, `You do not have any book with id: ${id} in your possession`);
    }

    if(new Date() > book.dueDate) {
      return Utils.errorStatus(
        res,
        400,
        'You cannot extend the borrowing period when the book is overdue. Kindly return the book to the library'
      );
    }

    if(new Date(date) <= book.dueDate) {
      return Utils.errorStatus(
        res,
        400,
        'The new date must be a date later than the previous due date'
      );
    }

    const newDate = new Date(date);
    models.BorrowedBooks.update(
      { dueDate: newDate },
      { where: { id } }
    );
    return Utils.successStatus(res, 200, 'Due date extended successfully',{
      dueDate: newDate,
    });
  }

  static async returnBook(req, res){
    const { isbn, patronId, damaged } = req.body;

    let fineCost = 0;
    let returnMessage = null;
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
  }

  static async reserveBook(req, res) {

    const { loggedinUser } = req;

    const { isbn } = req.query;

    const { title } = await models.Books.findOne({ where: { isbn }});

    let expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + 3);

    const reservedBook = await models.reservedBooks.create(
      {
        title, 
        isbn, 
        patronId: loggedinUser.id, 
        collected: false,
        timeToExpire: expiryDate
      });

    return Utils.successStatus(res, 200, 'Book reserved successfully', {
      id: reservedBook.id,
      title,
      isbn,
      patronId: reservedBook.patronId,
      collected: reservedBook.collected,
      Expires: reservedBook.timeToExpire.toDateString(),
    })
  }

  static async checkBookReservation(req, res) {

    const { loggedinUser } = req;


    const { patronId, isbn } = req.body;

    const user = await models.reservedBooks.findOne({ where: {
      [Op.and]: [{ isbn }, { patronId }]
    }});

    if( !user ) return Utils.errorStatus(res, 404, 'No Reservations were found for this user');

    await models.reservedBooks.destroy({ where: {
      [Op.and]: [{ isbn }, { patronId }]
    }});

    return BookController.lendBook(req, res);
  }
}

export default BookController;
