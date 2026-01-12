// Load Navbar into all pages
document.addEventListener("DOMContentLoaded", () => {
  fetch("components/navbar.html")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Navbar not found");
      }
      return res.text();
    })
    .then((data) => {
      const navbarContainer = document.getElementById("navbar");
      if (navbarContainer) {
        navbarContainer.innerHTML = data;
      }
    })
    .catch((err) => {
      console.error("Error loading navbar:", err);
    });
});
