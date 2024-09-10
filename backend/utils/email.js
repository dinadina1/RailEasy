const nodemailer = require("nodemailer");

// function to send mail
const sendMail = async (options) => {
  const transport = nodemailer.createTransport({
    service: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transport.sendMail(message);
};

// export function
module.exports = sendMail;
