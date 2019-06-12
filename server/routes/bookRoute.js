import express from 'express';
import BookController from '../controllers/bookController';
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const bookRoute = express.Router();

bookRoute.post('/', Validate.addBook, BookController.addBook);
bookRoute.get('/', BookController.getAllBooks);
bookRoute.get('/:id', Validate.id, BookController.getSpecificBook);
bookRoute.delete('/:id', Validate.id, BookController.deleteBook);
bookRoute.post('/request', 
Authenticate.isloggedIn, Validate.requestBook, BookController.requestBook)

bookRoute.post('/borrow', Authenticate.isloggedIn, Authenticate.isAdmin, Validate.lendBook, BookController.lendBook);

export default bookRoute;
