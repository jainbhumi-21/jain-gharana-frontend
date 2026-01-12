async function openRazorpayPayment({ orderId, amount }) {
  try {
    // 1️⃣ CREATE RAZORPAY ORDER (BACKEND)
    const razorpayRes = await fetch(
      "http://localhost:5000/api/orders/razorpay",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
        }),
      }
    );

    const razorpayData = await razorpayRes.json();

    if (!razorpayData.success) {
      alert("Unable to start payment");
      return;
    }

    // 2️⃣ OPEN RAZORPAY POPUP
    const options = {
      key: "rzp_test_xxxxxxxx", // ✅ TEST KEY ONLY
      amount: razorpayData.razorpayOrder.amount,
      currency: "INR",
      name: "Jain Gharana",
      description: "Spices Order Payment",
      order_id: razorpayData.razorpayOrder.id,

      handler: async function (response) {
        // 3️⃣ VERIFY PAYMENT
        const verifyRes = await fetch(
          "http://localhost:5000/api/orders/verify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            }),
          }
        );

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          localStorage.removeItem("cart");
          alert("Payment successful 🎉 Order confirmed");
          window.location.href = "my-orders.html";
        } else {
          alert("Payment verification failed ❌");
        }
      },

      modal: {
        ondismiss: function () {
          alert("Payment cancelled");
        },
      },

      theme: {
        color: "#c0392b",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Razorpay error:", err);
    alert("Payment failed. Try again.");
  }
}
