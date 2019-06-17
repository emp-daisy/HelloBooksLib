import express from 'express';
import BookController from '../controllers/bookController';
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const bookRoute = express.Router();

bookRoute.post('/', Validate.addBook, BookController.addBook);
bookRoute.get('/', BookController.getAllBooks);
bookRoute.get('/:id', Validate.id, BookController.getSpecificBook);
bookRoute.delete('/:id', Validate.id, BookController.deleteBook);
bookRoute.post(
  '/request',
  Authenticate.isLoggedIn,
  Validate.requestBook,
  BookController.requestBook
);

bookRoute.post(
  '/recieve',
  Authenticate.isLoggedIn,
  Authenticate.isAdmin,
  Validate.recieveBook,
  BookController.returnBook
);

bookRoute.post('/borrow',
  Authenticate.isLoggedIn,
  Authenticate.isAdmin,
  Validate.lendBook,
  BookController.lendBook
);

bookRoute.patch('/extend/:id',
  Authenticate.isLoggedIn,
  Validate.id,
  Validate.date,
  BookController.extendDueDate
);

export default bookRoute;
