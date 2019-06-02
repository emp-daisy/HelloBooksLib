import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const secretKey = process.env.SECRET_KEY;

class Auth {
	static generateMailToken(payload) {
		return jwt.sign(payload, secretKey, {expiresIn: '1hour'})
	}
	static verifyMailToken(token) {
		try {
			const payload = jwt.verify(token, secretKey);
			return payload;
		} catch(err) {
			throw err
		}
	}
}

export default Auth;