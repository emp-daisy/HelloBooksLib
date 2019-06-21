import express from 'express';
import AuthorController from '../controllers/authorController';
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const authorRoute = express.Router();

authorRoute.post('/', Authenticate.isLoggedIn, Authenticate.isAdmin, Validate.author, AuthorController.addAuthor);
authorRoute.get('/', Authenticate.isLoggedIn, AuthorController.listAuthor);
authorRoute.get('/:id',Authenticate.isLoggedIn, AuthorController.getAuthor);
authorRoute.patch('/:id', Authenticate.isLoggedIn, Authenticate.isAdmin, Validate.author, AuthorController.updateAuthor);
authorRoute.delete('/:id', Authenticate.isLoggedIn, Authenticate.isAdmin, AuthorController.deleteAuthor);
authorRoute.patch(
  '/favourite/:id',
  Authenticate.isLoggedIn,
  Validate.id,
  Authenticate.isOwnProfile,
  AuthorController.favouriteAnAuthor
);

export default authorRoute;
