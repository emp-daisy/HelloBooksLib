import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config();

const secretKey = process.env.SECRET_KEY;

class Auth {
	static generateMailToken(payload) {
		return jwt.sign(payload, secretKey, {expiresIn: '1hour'})
	}
	static verifyMailToken(token) {
		try {
			return jwt.verify(token, secretKey)
		} catch(err) {
			return {Error: `${err}`}
		}
	}
}

export default Auth;