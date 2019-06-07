import express from 'express';
import AuthorController from '../controllers/authorController'
import Validate from '../middleware/validation';
import Authenticate from '../middleware/authenticator';

const authorRoute = express.Router();

authorRoute.post('/', Validate.newAuthor, AuthorController.addAuthor);
authorRoute.get('/', Authenticate.isloggedIn, AuthorController.listAuthor);

export default authorRoute;
