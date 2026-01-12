document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/background/home")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.imageUrl) {
        document.body.style.backgroundImage = `url(${data.imageUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.minHeight = "100vh";
      }
    })
    .catch((err) => console.error("Background error:", err));
});
