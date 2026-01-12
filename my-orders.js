async function loadMyOrders() {
  try {
    const res = await fetch("http://localhost:5000/api/orders");
    const data = await res.json();

    const container = document.getElementById("ordersList");
    container.innerHTML = "";

    if (!data.success || data.orders.length === 0) {
      container.innerHTML = "<p>No orders found 😔</p>";
      return;
    }

    data.orders.forEach(order => {
      const itemsHTML = order.items
        .map(
          item =>
            `<li>${item.name} (${item.weight}g) × ${item.qty}</li>`
        )
        .join("");

      container.innerHTML += `
        <div class="order-card">
          <h3>Order ID: ${order._id}</h3>
          <p><b>Status:</b> ${order.shippingStatus}</p>
          <p><b>Total:</b> ₹${order.total}</p>
          <p><b>Address:</b> ${order.address}</p>

          <p><b>Items:</b></p>
          <ul>${itemsHTML}</ul>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    document.getElementById("ordersList").innerHTML =
      "<p>Error loading orders</p>";
  }
}

loadMyOrders();
