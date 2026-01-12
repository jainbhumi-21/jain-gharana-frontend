// elements
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");

// ================= SEND OTP =================
sendOtpBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Enter a valid 10-digit phone number");
    return;
  }

  try {
    const res = await apiPost("/auth/send-otp", { phone });

    if (res.success) {
      alert("OTP sent successfully 📲");

      // show OTP input
      otpInput.style.display = "block";
      verifyOtpBtn.style.display = "block";
    } else {
      alert(res.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    alert("Something went wrong while sending OTP");
  }
});

// ================= VERIFY OTP =================
verifyOtpBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();
  const otp = otpInput.value.trim();

  if (!otp) {
    alert("Please enter OTP");
    return;
  }

  try {
    const res = await apiPost("/auth/verify-otp", { phone, otp });

    if (res.success) {
      alert("Login successful 🎉");

      // save user in localStorage
      localStorage.setItem("user", JSON.stringify(res.user));

      // redirect to products
      window.location.href = "products.html";
    } else {
      alert(res.message || "Invalid OTP");
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    alert("Something went wrong while verifying OTP");
  }
});
