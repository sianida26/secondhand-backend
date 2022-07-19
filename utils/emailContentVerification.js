require('dotenv').config();
const emailContentVerification = (username, token) => {
  return ` 
  <!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <title></title>
        <!--[if mso]>
        <noscript>
            <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

            table,
            td,
            div,
            h1,
            p {
                font-family: 'Roboto', Helvetica, sans-serif;
            }

            #main-table {
                width: 100%;
                border-collapse: collapse;
                border: 0;
                border-spacing: 0;
            }

            #second-table {
                /* width: 602px; */
                width: 500px;
                border-collapse: collapse;
                border: 1px solid #cccccc;
                border-spacing: 0;
                text-align: left;
            }

            #content-table {
                width: 100%;
                border-collapse: collapse;
                border: 0;
                border-spacing: 0;
            }

            #top-table,
            #user-data-table,
            #invoice-table,
            #total-pay-table,
            #status-table {
                width: 100%;
                border-collapse: collapse;
                border: 0;
                border-spacing: 0;
                font-size: 9px;
            }

            #top-table td,
            #user-data-table td,
            #invoice-table td,
            #total-pay-table td,
            #status-table td {
                padding: 0;
                width: 50%;
            }

            #top-table p,
            #user-data-table p,
            #invoice-table p,
            #total-pay-table p,
            #status-table p {
                margin: 0;
                line-height: 16px;
            }
        </style>
    </head>

    <body style="margin: 0; padding: 0;">
        <table id="main-table" role="presentation">
            <tr>
                <td align="center" style="padding: 0;">
                    <table id="second-table" role="presentation" style="background-color: #ffffff;">
                        <tr>
                            <td style="padding: 30px">
                                <table id="top-table" role="presentation" style="margin: 0 0 20px 0;">
                                    <tr>
                                        <td align="left">
                                            <img src="https://firebasestorage.googleapis.com/v0/b/secondhand-cloud.appspot.com/o/images%2Femail%2FSecondHand.png?alt=media&token=4e5cf2d7-40ff-49a0-b7a3-23221cbd88b4"
                                                alt="secondhand-logo" srcset="">
                                        </td>
                                    </tr>
                                </table>

                                <table id="complete-registration-table" align="center" role="presentation"
                                    style="font-size: 16px; ">
                                    <tr>
                                        <h1 style="font-size: 30px;">Selesaikan Pendaftaranmu di SecondHand</h1>
                                    </tr>
                                    <tr>
                                        <p style="margin: 15px 0 0 0;">Halo <strong>${username}</strong>,</p>
                                        <p style="margin: 10px 0 0 0;">Silahkan Verifikasi Emailmu dengan mengeklik tombol
                                            dibawah
                                        </p>
                                    </tr>
                                </table>

                                <div align="center" style="margin: 60px 0 60px 0;">
                                    <a style="
                                            padding: 15px 43px 15px 43px; 
                                            background-color: #7126B5; 
                                            color: white; 
                                            text-decoration: none; 
                                            font-weight: bold; 
                                            border-radius: 40px;
                                            font-size: 16px;
                                        " href="${process.env.API_URL}/users/verify-email/${token}">
                                        Verifikasi Email
                                    </a>
                                </div>

                                <table id="invoice-table" role="presentation" style="margin: 30px 0 0 0;">
                                    <tr style="border-top: 1px solid #D0D0D0;">
                                        <td align="center">
                                            <p style="margin: 30px 0 0 0; font-size: 12px;">
                                                &reg; 2022 SecondHand, All Rights Reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        </td>
        </tr>

    </body>

    </html>
    `;
};

module.exports = emailContentVerification;
