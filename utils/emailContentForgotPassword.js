const emailContentForgotPassword = (token) => {
  return `
    <body>
      Email ini dikirim karena kamu meminta untuk melakukan pengaturan ulang kata sandi dari SecondHand
      <br />
      <br />
      Untuk mengatur ulang password kamu, klik link berikut:
      <br />
      https://secondhand-kita.vercel.app/forgot-password/${token}
      <br />
      <br />
      SecondHand Customer Service
    </body>
  `;
};

module.exports = emailContentForgotPassword;