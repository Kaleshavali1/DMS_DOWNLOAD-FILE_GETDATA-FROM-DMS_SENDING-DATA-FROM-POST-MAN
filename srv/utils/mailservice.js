const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  secure: false,
  tls: { rejectUnauthorized: false }
});

async function sendEmail(to, subject, html) {
  await transporter.sendMail({
    from: 'noreply@company.com',
    to,
    subject,
    html
  });
}

module.exports = { sendEmail };