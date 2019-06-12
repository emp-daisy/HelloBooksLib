import express from 'express';
import AuthorController from '../controllers/authorController'
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const authorRoute = express.Router();

authorRoute.post('/', Validate.author, AuthorController.addAuthor);
authorRoute.get('/', Authenticate.isLoggedIn, AuthorController.listAuthor);
authorRoute.get('/:id', AuthorController.getAuthor);
authorRoute.patch('/:id', Validate.author, AuthorController.updateAuthor);
authorRoute.delete('/:id', AuthorController.deleteAuthor);

export default authorRoute;
