import nodemailer from 'nodemailer';
import { config } from 'dotenv';
import debug from 'debug';

const log = debug('dev');
config();

export default class Mailer {
	static async notify(msg) {
		const response = await msg;
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.SERVER_MAIL,
				pass: process.env.MAIL_PASSWORD
			}
		});

		const mailOptions = {
			from: process.env.SERVER_MAIL,
			to: response.email,
			subject: response.subject,
			html: response.body
		}

		transporter.sendMail(mailOptions, (err, res) => err ? log(err) : log(res))
	}
}