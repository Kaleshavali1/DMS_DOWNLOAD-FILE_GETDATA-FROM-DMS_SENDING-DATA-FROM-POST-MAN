function buildSOTable(salesOrders) {
  const rows = salesOrders.map(so => `
    <tr>
      <td>${so.salesOrderNo}</td>
      <td>${so.CustomerID}</td>
      <td>${so.CustomerName}</td>
      <td>${so.OrderDate}</td>
      <td>${so.Status}</td>
    </tr>
  `).join('');

  return `
    <h2>SOs On Hold</h2>
    <table border="1">
      <thead>
        ...
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
    <p>Total: <b>${salesOrders.length}</b></p>
  `;
}

module.exports = { buildSOTable };