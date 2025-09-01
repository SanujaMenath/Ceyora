let cart = []; // global cart array

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem("cart");
  cart = saved ? JSON.parse(saved) : [];
}

// Load navbar + footer
document.addEventListener("DOMContentLoaded", () => {
  loadCart(); // ✅ restore cart first
  loadNavbar();
  loadFooter();
  if (document.getElementById("featured-products")) displayFeaturedProducts();
  if (document.getElementById("products-grid")) displayProducts();
  if (document.getElementById("contact-form")) setupContactForm();
  if (document.getElementById("cart-items")) displayCart();
  updateCartCount();
});

// Navbar
function loadNavbar() {
  document.getElementById("navbar").innerHTML = `
    <nav class="navbar">
      <div class="nav-left">
        <a href="index.html" class="brand"><span class="small-caps">Ceyora</span></a>
      </div>

      <!-- Hamburger -->
      <button class="hamburger" onclick="toggleMenu()">☰</button>

      <!-- Links + Cart (mobile combined) -->
      <div class="nav-panel" id="nav-panel">
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="products.html">Products</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact Us</a>
        </div>
        <div class="nav-cart mobile-cart">
          <a href="cart.html">Cart 🛒 <span id="cart-count-mobile">0</span></a>
        </div>
      </div>

      <!-- Desktop Cart -->
      <div class="nav-cart desktop-cart">
        <a href="cart.html">Cart 🛒 <span id="cart-count-desktop">0</span></a>
      </div>
    </nav>`;
}

function toggleMenu() {
  document.getElementById("nav-panel").classList.toggle("show");
}

// Footer
function loadFooter() {
  document.getElementById("footer").innerHTML = `
    <p>&copy; 2024 Ceylon Heritage. All rights reserved.</p>`;
}

// Cart Functions
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  const desktopEl = document.getElementById("cart-count-desktop");
  const mobileEl = document.getElementById("cart-count-mobile");

  if (desktopEl) desktopEl.textContent = total;
  if (mobileEl) mobileEl.textContent = total;
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) existing.quantity++;
  else cart.push({ ...product, quantity: 1 });

  saveCart(); // ✅ persist
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart(); // ✅ persist
  displayCart();
  updateCartCount();
}

function displayCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
    totalEl.textContent = "Rs. 0";
    return;
  }

  let total = 0;
  container.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `<div>
      ${item.emoji} ${item.name} x ${item.quantity} - Rs. ${(
        item.price * item.quantity
      ).toLocaleString()}
      <button onclick="removeFromCart(${item.id})">❌</button>
    </div>`;
    })
    .join("");
  totalEl.textContent = `Rs. ${total.toLocaleString()}`;
}

// Payment
function proceedToPayment() {
  if (cart.length === 0) {
    showNotification("Your cart is empty. Please add items before proceeding.");
    return;
  }
  document.getElementById("payment-section").classList.remove("hidden");
  window.scrollTo(0, document.body.scrollHeight);
}

function processPayment(method) {
  if (cart.length === 0) {
    showNotification("No items to checkout.");
    return;
  }

  showNotification(`Payment via ${method.toUpperCase()} successful!`);

  cart = [];
  saveCart(); // ✅ clear from localStorage
  updateCartCount();
  displayCart();

  // Hide payment section after payment
  document.getElementById("payment-section").classList.add("hidden");
}

// Products
function displayProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = products
    .map(
      (p) => `
    <div class="card">
       <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
       <p>${p.description}</p>
      <p class="price">Rs. ${p.price.toLocaleString()}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`
    )
    .join("");
}
function displayFeaturedProducts() {
  const container = document.getElementById("featured-products");
  container.innerHTML = products
    .filter((p) => p.featured)
    .map(
      (p) => `
    <div class="card">
       <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p class="price">Rs. ${p.price.toLocaleString()}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>`
    )
    .join("");
}
function filterProducts(category) {
  if (category === "all") displayProducts();
  else {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = products
      .filter((p) => p.category === category)
      .map(
        (p) => `
        <div class="card">
           <img src="${p.image}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          <p class="price">Rs. ${p.price.toLocaleString()}</p>
          <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`
      )
      .join("");
  }
}

// Contact Form
function setupContactForm() {
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("Thank you for your message!");
    e.target.reset();
  });
}

// Notifications
function showNotification(msg) {
  const div = document.createElement("div");
  div.className = "notification";
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}
