import dotenv from 'dotenv';

dotenv.config();

export default {
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackUrl:process.env.CALLBACK_URL,
    mongoUrl:process.env.MONGO_URL,
    secret:process.env.CLIENT_SECRET,
    adminEmail:process.env.ADMIN_EMAIL,
    adminPassword:process.env.ADMIN_PASSWORD,
    mailing: [{
        service: process.env.MAILING_SERVICE,
        user: process.env.MAILING_USER,
        password: process.env.MAILING_PASSWORD
    }],
}