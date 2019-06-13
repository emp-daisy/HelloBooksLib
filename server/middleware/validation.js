import { check, validationResult, param, query } from 'express-validator/check';
import util from '../helpers/utilities';
import models from '../db/models';

const validate = {
  signin: [
    check('email')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email should not be left empty: Please input email address')
      .isEmail()
      .trim()
      .withMessage('Email is not valid: Please input a valid email address'),
    check('password')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Password should not be empty: Please input password'),
      
    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    },
  ],
  assignrole : [
    check('email')
      .not()
      .isEmpty({ ignore_whitespace: true})
      .withMessage('Email should not be empty: Please input a valid email address')
      .isEmail()
      .trim()
      .withMessage('Email is not valid: Please input a valid email address'),
    check('role')
     .not()
     .isEmpty({ ignore_whitespace: true})
     .withMessage('Role should not be empty: Please input a valid user role')
     .isAlpha()
     .trim()
     .withMessage('Role is not valid: please use a valid user role'),
      (req, res, next) => {
        const errors = validationResult(req);
        const errMessages = [];
        if (!errors.isEmpty()) {
          errors.array({ onlyFirstError: true }).forEach((err) => {
            errMessages.push(err.msg);
          });
          return util.errorStatus(res, 400, errMessages);
        }
        return next();
    },
  ],

  signup: [
    check('firstName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage(
        'First Name should not be left empty: Please input firstName'
      )
      .isAlpha()
      .trim()
      .withMessage(
        'first Name can only contain letters: Please remove invalid characters'
      ),
    check('lastName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Last name should not be left empty: Please input lastName')
      .isAlpha()
      .trim()
      .withMessage(
        'Last name can ony contain letters: remove invalid characters'
      ),
    check('email')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Email should not be left empty: Please input email address')
      .isEmail()
      .trim()
      .withMessage('Email is not valid: Please input a valid email address'),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach(err => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    }
  ],

  password: [
    check('password')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Password should not be empty: Please input password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, 'i')
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter and one numeric digit'
      )
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password Length should be at least 8 Characters'),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach(err => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    }
  ],

  addBook: [
    check('title')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Title can not be left empty: Please input title'),
    check('description')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Description can not be left empty: Please input description'),
    check('amount')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Amount can not be left empty: Please input amount')
      .isCurrency()
      .withMessage('Amount is not valid currency: Please input a valid amount'),
    check('isbn')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('ISBN can not be left empty: Please input isbn')
      .isNumeric()
      .withMessage('ISBN is not valid currency: Please input a valid isbn'),
    check('authorID')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('AuthorID can not be left empty: Please input authorID')
      .isInt()
      .withMessage('AuthorID is not valid integer: Please input a valid authorID')
      .custom( async (id) => {
        const isExist = await util.exits(id, 'Authors');
        if (!isExist) {
          throw new Error('No author with the specified ID was found')
        }

        return true;
      }),
    check('categoryID')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('CategoryID can not be left empty: Please input categoryID')
      .isInt()
      .withMessage('categoryID is not valid integer: Please input a valid categoryID')
      .custom( async (id) => {
        const isExist = await util.exits(id, 'Categories');
        if (!isExist) {
          throw new Error('No Category with the specified ID was found')
        }
        return true;
      }),
    check('year')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Year can not be left empty: Please input amount')
      .isNumeric({ min: 1000, max: 2019 })
      .withMessage('Year is not valid year: Please input a valid year')
      .isLength({ min: 4, max: 4 })
      .withMessage('Year is not valid year: Please input a valid year'),
    check('status')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Active status can not be left empty: Please input active')
      .isIn('Available', 'Borrowed')
      .withMessage('Status can only be "Available" or "Borrowed": Please input a valid Status'),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    },
  ],

  author : [
    check('firstName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('First Name should not be left empty: Please input firstName')
      .isAlpha()
      .trim()
      .withMessage('first Name can only contain letters: Please remove invalid characters'),
    check('middleName')
      .custom((item) => {
        if(item){
          if(!item.match(/^[A-Za-z]+$/)) {
            throw new Error('Middle Name name can ony contain letters: remove invalid characters');
          }
        }
        return true;
      }),
    check('lastName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Last name should not be left empty: Please input lastName')
      .isAlpha()
      .trim()
      .withMessage('Last name can ony contain letters: remove invalid characters'),
      
    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    },
  ],

  resetPassword : [
    check('password')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Password should not be empty: Please input password')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/, "i")
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter and one numeric digit')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password Length should be at least 8 Characters'),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array().forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    },
  ],

  role: [
    param('role')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('role should not be left empty')
      .isIn(['user', 'admin'])
      .withMessage('Should be admin or user')
      .isAlpha()
      .trim(),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array().forEach(err => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    }
  ],

  id : [
    param('id')
      .matches(/^[1-9][0-9]*$/)
      .withMessage('ID must be a number greater than 1'),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    },
  ],

  requestBook : [
    check('title')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Title can not be left empty: Please input title'),
  check('description')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Description can not be left empty: Please input description'),
  check('author')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Author can not be left empty: Please input author'),
  check('categoryID')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('CategoryID can not be left empty: Please input categoryID')
    .isInt()
    .withMessage('categoryID is not valid integer: Please input a valid categoryID')
    .custom( async (id) => {
      const isExist = await util.exits(id, 'Categories');
      if (!isExist) {
        throw new Error('No Category with the specified ID was found')
      }
      return true;
    }),
  check('year')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Year can not be left empty: Please input amount')
    .isNumeric({ min: 1000, max: 2019 })
    .withMessage('Year is not valid year: Please input a valid year')
    .isLength({ min: 4, max: 4 })
    .withMessage('Year is not valid year: Please input a valid year'),
  check('userID')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('UserID can not be left empty: Please input userID')
    .isInt()
    .withMessage('UserID is not valid integer: Please input a valid userID')
    .custom( async (id) => {
      const isExist = await util.exits(id, 'Users');
      if (!isExist) {
        throw new Error('No User with the specified ID was found')
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    const errMessages = [];
    if (!errors.isEmpty()) {
      errors.array({ onlyFirstError: true }).forEach((err) => {
        errMessages.push(err.msg);
      });
      return util.errorStatus(res, 400, errMessages);
    }
    return next();
  },  ],

  userId: [
    query('userId')
      .optional()
      .isInt()
      .withMessage('ID must be a number greater than 1'),

      (req, res, next) => {
        const errors = validationResult(req);
        const errMessages = [];
        if (!errors.isEmpty()) {
          errors.array({ onlyFirstError: true }).forEach(err => {
            errMessages.push(err.msg);
          });
          return util.errorStatus(res, 400, errMessages);
        }
        return next();
      }
  ],

  lendBook : [
    check('isbn')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('ISBN can not be left empty: Please input ISBN')
      .isInt()
      .withMessage('ISBN is not valid integer: Please input a valid ISBN')
      .custom( async (isbn) => {
        const Book = await models.Books.findOne({ where: { isbn } });
        if (!Book) {
          throw new Error('No Book with the specified isbn was found')
        }
        if (Book.dataValues.status === 'borrowed') {
          throw new Error('This book has been borrowed out already')
        }
        return true;
      }),
    check('patronId')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('patronId can not be left empty: Please input patronId')
      .isInt()
      .withMessage('patronId is not valid integer: Please input a valid patronId')
      .custom( async (id) => {
        const isExist = await models.Users.findOne({ where: { id } });
        if (!isExist) {
          throw new Error('No Book with the specified isbn was found')
        }
        return true;
      }),

    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return util.errorStatus(res, 400, errMessages);
      }
      return next();
    }
  ]
}

export default validate;
