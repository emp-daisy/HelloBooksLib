import sendgridMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import debug from 'debug';

dotenv.config();

const log = debug('dev');

sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Mailer Class
 */
class Mailer {
  /**
   * Email trasporter
   * @param {String} to - Reciever email
   * @param {String} from - Sender email
   * @param {String} subject - Email subject
   * @param {String} html - Email body
   * @returns  {Object} - Mailer response
   */
  static async sendMail(to, from, subject, html) {
    const mail = {
      to,
      from,
      subject,
      html,
    };
    log(mail.to);
    return sendgridMail.send(mail)
      .then(() => log('Message Sent!'))
      .catch((err) => log(err.message))
  }

  /**
   * Sends messages to recievers
   * @param {String} email - Reciever email
   * @param {String} firstName - Reciever firstname
   * @param {String} link - Verification link
   * @returns {Object} - Mailer response
   */
  static async sendWelcomeMail(email, firstName, link) {
    const senderEmail = process.env.SERVER_MAIL;
    const linkStyle = `
      display:inline-block;
      padding:5px 10px; 
      border:1px solid #5d45e3; 
      text-decoration: none; 
      text-transform: uppercase; 
      font-size: medium; 
      color: white; 
      background: #5d45e3; 
      border-radius: 3px;
    `;
    const html = `
      <div style="width: 480px; margin: auto;">
        <h2> Welcome to Hello-Books! </h2>
        <p style="font-size: 1.1em">
          Hey ${firstName}, congrats on successfully signing up for Hello-Books!
          <br>Please verify your email address by clicking on the button below. 
        </p>
        <div style="text-align: center;">
          <a href="${link}"
            style="${linkStyle}"
            >Verify Email
          </a>
        </div>
        <p>Thanks, <br />The Hello Books Team</p>
      </div>
    `;
    try {
      await Mailer.sendMail(email, senderEmail, 'Welcome to Hello Books', html);
    }catch(err){
      log(err.message)
    }
  }

  /**
   * Sends messages to recievers
   * @param {String} email - Reciever email
   * @param {String} firstName - Reciever firstname
   * @param {String} password - Users password
   * @returns {Object} - Mailer response
   */
  static async sendAdminMail(email, firstName, password) {
    const senderEmail = process.env.SERVER_MAIL;
    const html = `
      <div style="width: 480px; margin: auto;">
        <h2> Welcome to Hello-Books! </h2>
        <p style="font-size: 1.1em">
          Hey ${firstName}, congrats you have been successfully signed up! 
        </p>
        <div style="text-align: center;">
          <p>Here is your password ${password}</p>
        </div>
        <p>Thanks, <br />The Hello Books Team</p>
      </div>
    `;
    try {
      await Mailer.sendMail(email, senderEmail, 'Welcome to Hello Books', html);
    } catch (err) {
      log(err.message);
    }
  }

  /**
   * Sends the mail to initiate password reset
   * @param {String} email - Reciever email
   * @param {String} firstName - Reciever firstname
   * @param {String} link - Verification link
   * @returns {Object} - Mailer response
   */
  static async initiateResetMail(email, firstName, link) {
    const senderEmail = process.env.SERVER_MAIL;
    const linkStyle = `
      display:inline-block;
      padding:5px 10px; 
      border:1px solid blue; 
      text-decoration: none; 
      text-transform: uppercase; 
      font-size: medium; 
      color: white; 
      background: #5d45e3; 
      border-radius: 3px;
    `;
    const html = `
      <p style="font-size: 1.1em">
        Hey <em style='text-transform: capitalize'>${firstName}</em> <br>
        You recently requested to reset the password for your Hello Books account. 
        Please click the link below to reset it. <br>
        <div style="text-align: center;">
          <a href="${link}"
            style="${linkStyle}"
            >Reset Password
          </a>
        </div> 
        <br>
        If you did not request a password reset, please ignore this email or reply to let us know.
        The link is only valid for the next 30mins. <br>
        Thanks,<br>
        The Hello Books Team
      </p>
    `;
    try {
      await Mailer.sendMail(email, senderEmail, 'Password Reset', html);
    }catch(err){
      log(err.message)
    }
  }
}

export default Mailer;
