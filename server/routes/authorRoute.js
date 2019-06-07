import express from 'express';
import AuthorController from '../controllers/authorController'
import Validate from '../middleware/validation';

const authorRoute = express.Router();

authorRoute.post('/', Validate.author, AuthorController.addAuthor);
authorRoute.get('/:id', AuthorController.getAuthor);
authorRoute.patch('/:id', Validate.author, AuthorController.updateAuthor);

export default authorRoute;
