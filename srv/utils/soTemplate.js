// function buildSOTable(salesOrders) {
//   const rows = salesOrders.map(so => `
//     <tr>
//       <td>${so.salesOrderNo}</td>
//       <td>${so.CustomerID}</td>
//       <td>${so.CustomerName}</td>
//       <td>${so.OrderDate}</td>
//       <td>${so.Status}</td>
//     </tr>
//   `).join('');

//   return `
//     <h2>SOs On Hold</h2>
//     <table border="1">
//       <thead>
//         ...
//       </thead>
//       <tbody>
//         ${rows}
//       </tbody>
//     </table>
//     <p>Total: <b>${salesOrders.length}</b></p>
//   `;
// }

// module.exports = { buildSOTable };

function buildSOTable(salesOrders) {
  const App_Url = process.env.App_URL;
  const rows = salesOrders.map(so => `
    <tr>
      <td>${so.salesOrderNo}</td>
      <td>${so.CustomerID}</td>
      <td>${so.CustomerName}</td>
      <td>${so.OrderDate}</td>
      <td>${so.Status}</td>
      <td>
        <a href="${App_Url}#/SalesOrders(ID=${so.ID},IsActiveEntity=true)" 
        target="_blank"
        style="
                        background:#0a6ed1;
                        color:white;
                        text-decoration:none;
                        padding:8px 14px;
                        border-radius:4px;
                        font-weight:bold;
                        display:inline-block;
                    "
                >
                    🔍 View
          ${so.salesOrderNo}
        </a>
      </td>
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
