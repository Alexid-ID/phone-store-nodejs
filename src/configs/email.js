import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: '29thnov03@gmail.com',
        pass: 'jjsloymhwkvyvpjg'
    }
});
export default transporter;