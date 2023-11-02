import mailer from "nodemailer";
import config from "../config/config.js";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: 'anabelag1991@gmail.com',
        pass: 'csdn ofkl gnsa wltp',
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html, attachments = [] }) => {
    let result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
      attachments,
    });
    console.log(result);
    return result;
  };
}