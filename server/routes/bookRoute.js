import express from 'express';
import BookController from '../controllers/bookController';
import Validate from '../middleware/validation';

const bookRoute = express.Router();

bookRoute.post('/', Validate.addBook, BookController.addBook);
bookRoute.get('/', BookController.getBooks);

export default bookRoute;
