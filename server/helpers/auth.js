/* eslint-disable require-jsdoc */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

config();

const secret = process.env.SECRET_KEY;
const salt = 10;

class  Helper {
  static hashPassword(password) {
    return bcrypt.hashSync(password, salt);
  }

  static comparePassword(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
  }

  static generateToken(payload) {
    const token = jwt.sign(payload, secret, { expiresIn: 86400 });
    return token;
  }

  static getOneTimeToken(payload, otp) {
    const token = jwt.sign(payload, otp, { expiresIn: '30 mins' });
    return token;
  }

  static generateMailToken(payload) {
		return jwt.sign(payload, secret, {expiresIn: '1hour'})
	}

  static verifyMailToken(token) {
		try {
			const payload = jwt.verify(token, secret);
			return payload;
		} catch(err) {
			throw err
		}
	}
};

export default Helper;
