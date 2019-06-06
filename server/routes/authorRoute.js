import express from 'express';
import AuthorController from '../controllers/authorController';
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const authorRoute = express.Router();

authorRoute.post('/', Validate.author, AuthorController.addAuthor);
authorRoute.get('/', Authenticate.user, AuthorController.listAuthor);
authorRoute.get('/:id', Validate.id, AuthorController.getAuthor);
authorRoute.patch(
  '/:id',
  Validate.id,
  Validate.author,
  AuthorController.updateAuthor
);
authorRoute.delete('/:id', Validate.id, AuthorController.deleteAuthor);

export default authorRoute;
