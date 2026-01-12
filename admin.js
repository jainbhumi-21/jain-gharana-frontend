async function loadOrders() {
  const table = document.getElementById("ordersTable");

  table.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const res = await fetch("http://localhost:5000/api/orders");
    const data = await res.json();

    if (!data.success || !data.orders.length) {
      table.innerHTML = `<tr><td colspan="6">No orders found</td></tr>`;
      return;
    }

    table.innerHTML = "";

    data.orders.forEach(order => {
      let items = "";
      order.items.forEach(i => {
        items += `${i.name} (${i.weight}g × ${i.qty})<br>`;
      });

      table.innerHTML += `
        <tr>
          <td>${order._id}</td>
          <td>
            ${order.name}<br>
            ${order.phone}<br>
            ${order.address}
          </td>
          <td>${items}</td>
          <td>₹${order.total}</td>
          <td class="status ${order.shippingStatus}">
            ${order.shippingStatus}
          </td>
          <td>
            <select onchange="updateStatus('${order._id}', this.value)">
              <option ${order.shippingStatus === "Pending" ? "selected" : ""}>Pending</option>
              <option ${order.shippingStatus === "Packed" ? "selected" : ""}>Packed</option>
              <option ${order.shippingStatus === "Shipped" ? "selected" : ""}>Shipped</option>
              <option ${order.shippingStatus === "Out-for-Delivery" ? "selected" : ""}>Out-for-Delivery</option>
              <option ${order.shippingStatus === "Delivered" ? "selected" : ""}>Delivered</option>
              <option ${order.shippingStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error(err);
    table.innerHTML = `<tr><td colspan="6">Error loading orders</td></tr>`;
  }
}

async function updateStatus(orderId, status) {
  await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shippingStatus: status })
  });

  loadOrders();
}

loadOrders();
