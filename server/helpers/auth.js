import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.SECRET_KEY;
const salt = 10;

const Helper = {
  hashPassword(password) {
    return bcrypt.hashSync(password, salt);
  },

  comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  },

  generateToken(payload) {
    const token = jwt.sign(payload, secret, { expiresIn: 86400 });
    return token;
  }
};

export default Helper;
