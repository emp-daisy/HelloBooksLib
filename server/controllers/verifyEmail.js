import Auth from '../../app/helpers/auth';
import Mailer from '../../app/helpers/nodemailer';
import models from '../../db/models'

const { User } = models;

export default class VerifyEmail {
	/**
    * @description generates email verification link and send to new user email
    * @param req express request object
    * @param res express response object
    * @returns next() middleware
    */
	static async generateEmailLink(req, res, next) {
		const {firstName, lastName, email, password } = req.body;
		const token = Auth.generateMailToken({firstName, lastName, email, password});
		const link = `https://localhost:3000/verifyEmail?token=${token}`;
		const sectionStyle = 'color: #fff; background-color: grey; ';
		const linkStyle = `padding: 20px; 
						   border-radius: 4px; 
						   text-align: center; 
						   font-weight: bold; 
						   background-color: #5D45E3`;

		const body = `<section style=${style}>
						<h2 style='text-align: center; color: #5D45E3 '>Greetings ${firstName}!</h2>
						<div> 
							You have successfully registered an account with HelloBooks website.
							To activate your account, kindly confirm your registration.

							<a href='${link}' style=${linkStyle}> VERIFY YOUR EMAIL</a>

							<p>
								Note: If you do not use this link before 1hour it
								will expire, and you may need to sign up again.
								Any questions? send us an email info@hellobooks.com.ng
							</p>
						</div>	
					</section>
					`;

		const mailObj = {
			email,
			subject: 'Verify Email',
			body,
		};
		try {
			await Mailer.notify(mailObj);
			User.findOne({ where: {email}}).then(user => {
				user.email_confirm_code.set(token)
			})
			// this should call the next middleware
			next();
		} catch(err) {
			res.status(400).json({
			status: res.statusCode,
			message: `${err}`
		});
		}
		
		

	}
	/**
    * @description checks if user email is correct when user can access the link generated
    * @param req express request object
    * @param res express response object
    * @redirects user to dashboard or login
    */
	static async verifyEmailLink(req, res) {
		const { token } = req.params;
		const payload = Auth.verifyMailToken(token) 
		if(!payload) {
			res.status(400).json({
				status: res.statusCode,
				message: 'Invalid verification link'
			})
		} else {
			try {
				User.findOne({ where: {email: payload.email}}).then(user => {
				user.email_confirm_code.set(null)
			  })
				//this is just for test sake, it should redirect the user to their dashboard.
			res.status(200).json({
				status: 200,
				message: 'Email verification successful',
				data: {
					firstName: payload.firstName,
					lastName: payload.lastName,
					email: payload.email
				}
			})

			} catch(err) {
				res.status(400).json({
					status: res.statusCode,
					error: `${err}`
				})
			}
			
		}
	}
}