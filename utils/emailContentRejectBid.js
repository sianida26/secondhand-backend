const emailContentRejectBids = (buyer, seller, noPesanan, productName, bidPrice, status, datetime) => {
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
      background: #ffffff;
    }

    #second-table {
      /* width: 602px; */
      width: 500px;
      border-collapse: collapse;
      border: 1px solid #cccccc;
      border-spacing: 0;
      text-align: left;
      background: #ffffff;
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
            <td style=" padding: 30px">
              <table id="top-table" role="presentation" style="margin: 0 0 50px 0;">
                <tr>
                  <td align="left">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/secondhand-cloud.appspot.com/o/images%2Femail%2FSecondHand.png?alt=media&token=4e5cf2d7-40ff-49a0-b7a3-23221cbd88b4"
                      alt="secondhand-logo" srcset="">
                  </td>
                  <td align="right">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68);">BID #${noPesanan}</p>
                  </td>
                </tr>
              </table>

              <table id="user-data-table" role="presentation">
                <tr>
                  <td align="left">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68);">Nama</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68);">Waktu</p>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <p style="font-size: 14px;
                    font-weight: bold;
                    margin: 10px 0 0 0;">${buyer}</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 14px;
                    font-weight: bold;
                    margin: 10px 0 0 0;">${new Date(datetime).toLocaleString()}</p>
                  </td>
                </tr>
              </table>

              <table id="status-table" role="presentation" style="margin: 25px 0 0 0;">
                <tr>
                  <td align="left">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68);">Seller</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68);">Status</p>
                  </td>
                </tr>

                <tr>
                  <td align="left">
                    <p style="font-size: 14px;
                    font-weight: bold;
                    margin: 10px 0 0 0;">${seller}</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 14px;
                    font-weight: bold;
                    margin: 10px 0 0 0;
                    color: #e23636;">${status}</p>
                  </td>
                </tr>
              </table>

              <h1 style="font-size: 15px;
              margin: 40px 0 5px 0;
              font-family: Helvetica, sans-serif;
              color: #7126B5;">Ringkasan Penawaran</h1>

              <table id="invoice-table" role="presentation" style="margin: 30px 0 0 0;">
                <tr>
                  <td align="left">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68); margin: 0 0 10px 0;">Product</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 12px;
                    color: rgba(49, 53, 59, 0.68); margin: 0 0 10px 0;">Harga Penawaran</p>
                  </td>
                </tr>

                <tr style="border-top: 1px solid #D0D0D0;
                border-bottom: 1px solid #D0D0D0;">
                  <td align="left">
                    <p style="font-size: 14px;
                    margin: 10px 0 10px 0;">${productName}</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 14px;
                    margin: 10px 0 10px 0;">Rp ${Number(bidPrice)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                  </td>
                </tr>
              </table>

              <table id="total-pay-table" role="presentation" style="margin: 25px 0 0 0;">
                <tr>
                  <td align="left">
                    <p style="font-size: 14px;
                    font-weight: bold;">Total</p>
                  </td>

                  <td align="right">
                    <p style="color: #7126B5;
                    font-size: 14px;
                    font-weight: bold;">Rp ${Number(bidPrice)
                      .toFixed(2)
                      .replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                  </td>
                </tr>
              </table>

              <table id="bottom-table" align="center" role="presentation" style="font-size: 12px;">
                <tr>
                  <td>
                    <p style="margin: 30px 0 0 0;">&reg; 2022 SecondHand, All Rights Reserved.</p>
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

module.exports = emailContentRejectBids;
