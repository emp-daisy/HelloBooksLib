import express from 'express';
import BookController from '../controllers/bookController';
import Validate from '../middleware/validation';

const bookRoute = express.Router();

bookRoute.post('/', Validate.addBook, BookController.addBook);
bookRoute.get('/', BookController.getAllBooks);
bookRoute.get('/:id', Validate.id, BookController.getSpecificBook);
bookRoute.delete('/:id', Validate.id, BookController.deleteBook);

export default bookRoute;
