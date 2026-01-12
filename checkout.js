const form = document.getElementById("checkoutForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const paymentMethod = document.getElementById("paymentMethod").value;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!name || !phone || !address || !cart.length) {
    alert("Please fill all details and add items to cart");
    return;
  }

  let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // COD extra charge
  if (paymentMethod === "COD") {
    total += 50;
  }

  try {
    // 1️⃣ CREATE ORDER (ALWAYS FIRST)
    const orderRes = await fetch("http://localhost:5000/api/orders/place", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        address,
        items: cart,
        total,
        paymentMethod,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderData.success) {
      alert(orderData.message || "Order creation failed");
      return;
    }

    const orderId = orderData.order._id;

    // 2️⃣ COD FLOW
    if (paymentMethod === "COD") {
      localStorage.removeItem("cart");
      alert("Order placed successfully 🎉");
      window.location.href = "my-orders.html";
      return;
    }

    // 3️⃣ ONLINE FLOW → CALL RAZORPAY.JS
    openRazorpayPayment({
      orderId,
      amount: total,
    });

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Try again.");
  }
});
