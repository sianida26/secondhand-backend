require('dotenv').config();
const nodemailer = require('nodemailer');
const emailContentAcceptBids = require('../utils/emailContentAcceptBid');
const emailContentForgotPassword = require('../utils/emailContentForgotPassword');

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

function sendEmailToBuyer(buyerName, bidId, productName, bidPrice, buyerEmail, subject, status) {
  sendEmail(buyerEmail, subject, emailContentAcceptBids(buyerName, bidId, productName, bidPrice, status));
}

function sendEmailToUserForgotPassword(email, token) {
  const subject = "SecondHand Reset Password";
  sendEmail(email, subject, emailContentForgotPassword(token));
}

async function sendEmail(to, subject, content) {
  // create reusable transporter object using the default SMTP transport
  try {
    let transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'customer-care@secondhand.dcare.id',
      to,
      subject,
      html: content,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.err;
  }
}

module.exports = {
  sendEmailToBuyer,
  sendEmailToUserForgotPassword
};
