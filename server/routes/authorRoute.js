import express from 'express';
import AuthorController from '../controllers/authorController'
import Validate from '../middleware/validation';

const authorRoute = express.Router();

authorRoute.post('/', Validate.newAuthor, AuthorController.addAuthor);

export default authorRoute;
