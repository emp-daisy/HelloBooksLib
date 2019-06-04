import {check, validationResult} from 'express-validator/check';
import util from '../helpers/utilities';

const validate = {
  signin : [
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
  signup : [
    check('firstName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('First Name should not be left empty: Please input firstName')
      .isAlpha()
      .trim()
      .withMessage('first Name can only contain letters: Please remove invalid characters'),
    check('lastName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('Last name should not be left empty: Please input lastName')
      .isAlpha()
      .trim()
      .withMessage('Last name can ony contain letters: remove invalid characters'),
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
          errors.array({ onlyFirstError: true }).forEach((err) => {
            errMessages.push(err.msg);
          });
          return util.errorStatus(res, 400, errMessages);
        }
        return next();
    },
  ],

  newAuthor : [
    check('firstName')
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage('First Name should not be left empty: Please input firstName')
      .isAlpha()
      .trim()
      .withMessage('first Name can only contain letters: Please remove invalid characters'),
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
}

export default validate;
