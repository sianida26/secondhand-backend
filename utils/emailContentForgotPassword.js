const emailContentForgotPassword = (token) => {
  return `
    <body>
      <div style="padding: 20px;">
        <h4>Reset Password!</h4>
        Email ini dikirim karena kamu meminta untuk melakukan pengaturan ulang kata sandi dari SecondHand
        <br />
        <br />
        Untuk mengatur ulang kata sandi kamu, klik link berikut:
        <br />
        https://secondhand-kita.vercel.app/forgot-password/${token}
        <br />
        <br />
        SecondHand Customer Service
      </div>
    </body>
  `;
};

module.exports = emailContentForgotPassword;