import mailer from "nodemailer";

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
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