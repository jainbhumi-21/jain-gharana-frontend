const productList = document.getElementById("productList");

async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    if (!res.ok) throw new Error("Fetch failed");

    productList.innerHTML = "";

    products.forEach(p => {
      const div = document.createElement("div");
      div.className = "product-card";

      div.innerHTML = `
        <img 
          src="./images/${p.image}" 
          alt="${p.name}"
          style="width:100%; height:180px; object-fit:contain; margin-bottom:10px;"
        />
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button>Add to Cart</button>
      `;

      productList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    productList.innerText = "Error loading products";
  }
}

loadProducts();
