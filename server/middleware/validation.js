import {check, validationResult} from 'express-validator/check';

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
      .withMessage('Password should not be empty: Please input password')
      .trim()
      .isLength({ min: 7 })
      .withMessage('Password Length should be at least 8 Characters'),
      
    (req, res, next) => {
      const errors = validationResult(req);
      const errMessages = [];
      if (!errors.isEmpty()) {
        errors.array({ onlyFirstError: true }).forEach((err) => {
          errMessages.push(err.msg);
        });
        return res.status(400).json({
          status: 400,
          error: errMessages,
        });
      }
      return next();
  },
  ]  
}

export default validate;