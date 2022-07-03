// TODO: buat variabel dimasing-masing table berdasarkan data bid buyer
const emailContentAcceptBids = () => {
  return ` 
  Halo buyer 
  <br>
  <br>
  <strong>Rincian penawaran</strong>
  <head>
    <style>
        body {
        font-family: helvetica;
        }
        table {
        margin-top: 5px;
        border-top: 2px solid black;
        }
        table, th, td {
        border-collapse: collapse;
        text-align: left
        }
        th, td {
        border-bottom: 1px solid #adadad;
        padding: 15px 5px;
        }
        th {
        width: 190px;
        background-color: #f9f9f9;
        font-weight: 400;
        }
        td {
        width: 60%;
        border-left: 1px solid #adadad;
        }
    </style>
  </head>
  <table>
    <tr>
      <th>Nomor Pesanan</th>
      <td>Person 2</td>
    </tr>
    <tr>
      <th>Produk</th>
      <td>Person 2</td>
    </tr>
    <tr>
      <th>Harga Penawaran</th>
      <td>Person 2</td>
    </tr>
    <tr>
      <th>Status</th>
      <td>Diterima</td>
    </tr>
  </table>
  `;
};

module.exports = emailContentAcceptBids;
