const emailContentAcceptBids = (buyer, noPesanan, productName, bidPrice, status) => {
  return ` 
  <head>
    <style>
      body {
        font-family: helvetica;
      }
      table {
        margin-top: 5px;
        border-top: 2px solid black;
        width: 100%;
      }
      table,
      th,
      td {
        border-collapse: collapse;
        text-align: left
      }
      th,
      td {
        border-bottom: 1px solid #adadad;
        padding: 15px 5px;
      }
      th {
        width: 30%;
        background-color: #f9f9f9;
        font-weight: 400;
      }
      td {
        width: 70%;
        border-left: 1px solid #adadad;
      }
    </style>
  </head>
  <body>
    Halo <strong>${buyer}</strong> <br><br>
    Terima kasih atas kepercayaan kamu bertransaksi di secondhand. Berikut adalah rincian informasi penawaran <br><br><br>
    <strong>Ringkasan Penawaran</strong>
    <table>
      <tr>
        <th>Nomor Pesanan</th>
        <td>${noPesanan}</td>
      </tr>
      <tr>
        <th>Produk</th>
        <td>${productName}</td>
      </tr>
      <tr>
        <th>Harga Penawaran</th>
        <td>${bidPrice}</td>
      </tr>
      <tr>
        <th>Status</th>
        <td>${status}</td>
      </tr>
    </table>
  </body>
  `;
};

module.exports = emailContentAcceptBids;
