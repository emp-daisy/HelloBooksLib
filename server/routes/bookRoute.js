import express from 'express';
import BookController from '../controllers/bookController';
import Validate from '../middleware/validation';

const bookRoute = express.Router();

bookRoute.post('/', Validate.addBook, BookController.addBook);

export default bookRoute;
