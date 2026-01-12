/***********************
 * CART UTILITIES
 ***********************/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  // 🔥 safe: cartCount ho ya na ho
  const badge = document.getElementById("cartCount");
  if (badge) badge.innerText = count;
}

/***********************
 * ADD TO CART (FROM PRODUCTS PAGE)
 ***********************/
function addToCart(product) {
  const cart = getCart();

  const weightEl = document.getElementById(`weight-${product._id}`);
  const qtyEl = document.getElementById(`qty-${product._id}`);

  if (!weightEl || !qtyEl) {
    alert("Weight / Quantity missing");
    return;
  }

  const weight = Number(weightEl.value);
  let qty = Number(qtyEl.innerText);

  if (qty < 1 || isNaN(qty)) qty = 1;

  // 💰 price based on weight (100gm base)
  const price = (product.price * weight) / 100;

  const key = `${product._id}-${weight}`;

  const existing = cart.find((item) => item.key === key);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id: product._id,
      name: product.name,
      image: product.image,
      weight,
      price,
      qty,
    });
  }

  saveCart(cart);
  updateCartCount();
  alert("Added to cart 🛒");
}

/***********************
 * CART PAGE RENDER
 ***********************/
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!container || !totalEl) return;

  container.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty 🛒</p>";
    totalEl.innerText = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    container.innerHTML += `
      <div class="cart-row">
        <img src="${item.image}" alt="${item.name}" />
        <div>
          <h4>${item.name}</h4>
          <p>${item.weight} gm</p>
          <p>₹${item.price} × ${item.qty}</p>

          <div class="qty-box">
            <button onclick="updateQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${index}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  // 🚚 COD charge ₹50
  totalEl.innerText = total + 50;
}

/***********************
 * UPDATE QTY (+ / −)
 ***********************/
function updateQty(index, delta) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

/***********************
 * INIT
 ***********************/
renderCart();
updateCartCount();
