require('dotenv').config();
const nodemailer = require('nodemailer');
const emailContentAcceptBids = require('../utils/emailContentAcceptBid');
const emailContentRejectBids = require('../utils/emailContentRejectBid');
const emailContentInvoice = require('../utils/emailContentInvoice');
const emailContentNewBid = require('../utils/emailContentNewBid');
const emailContentVerification = require('../utils/emailContentVerification');
const emailContentForgotPassword = require('../utils/emailContentForgotPassword');

const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env;

function sendAcceptBidToBuyer(buyerName, sellerName, bidId, productName, bidPrice, buyerEmail, subject, status, datetime) {
  sendEmail(buyerEmail, subject, emailContentAcceptBids(buyerName, sellerName, bidId, productName, bidPrice, status, datetime));
}

function sendRejectBidToBuyer(buyerName, sellerName, bidId, productName, bidPrice, buyerEmail, subject, status, datetime) {
  sendEmail(buyerEmail, subject, emailContentRejectBids(buyerName, sellerName, bidId, productName, bidPrice, status, datetime));
}

function sendInvoiceToBuyer(buyerName, sellerName, bidId, productName, bidPrice, buyerEmail, subject, status, datetime) {
  sendEmail(buyerEmail, subject, emailContentInvoice(buyerName, sellerName, bidId, productName, bidPrice, status, datetime));
}

function sendNewBidNotifToSeller(buyerName, productName, bidPrice, sellerEmail, subject, datetime) {
  sendEmail(sellerEmail, subject, emailContentNewBid(buyerName, productName, bidPrice, datetime));
}

function sendEmailVerification(userName, userEmail, subject, token) {
  sendEmail(userEmail, subject, emailContentVerification(userName, token));
}

function sendEmailToUserForgotPassword(email, token) {
  const subject = 'SecondHand Reset Password';
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
  sendAcceptBidToBuyer,
  sendRejectBidToBuyer,
  sendInvoiceToBuyer,
  sendNewBidNotifToSeller,
  sendEmailVerification,
  sendEmailToUserForgotPassword,
};
