//console.log("E-Commerce Website Loaded");

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.style.display =
    navLinks.style.display === 'flex' ? 'none' : 'flex';
});

document.querySelector('.cta-btn').addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#products').scrollIntoView({
    behavior: 'smooth'
  });
});

const productGrid = document.getElementById('productGrid');

// Fetch products from FakeStore API
async function loadProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title.substring(0, 20)}...</h3>
        <p>$${product.price.toFixed(2)}</p>
        <a href="#" class="add-btn">Add to Cart</a>
      `;

      productGrid.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading products:", error);
    productGrid.innerHTML = "<p>Failed to load products.</p>";
  }
}

loadProducts();

// Improved version with loading indicator and error handling

const API_URL = "https://fakestoreapi.com/products";

async function fetchProducts() {
  try {
    // Show loading before fetch
    showLoading();

    const response = await fetch(API_URL);
    const data = await response.json();

    // Save in cache for performance
    localStorage.setItem("products", JSON.stringify(data));

    hideLoading();
    renderProducts(data);

  } catch (error) {
    console.error("API Error:", error);
    showError("Failed to load products.");
  }
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = ""; // Clear old content

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" loading="lazy" alt="${product.title}">
      <h3>${product.title.substring(0, 20)}...</h3>
      <p>$${product.price.toFixed(2)}</p>
      <a class="add-btn">Add to Cart</a>
    `;

    grid.appendChild(card);
  });
}

function showLoading() {
  document.getElementById("loadingMessage").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingMessage").style.display = "none";
}

function showError(message) {
  document.getElementById("errorMessage").innerText = message;
  document.getElementById("errorMessage").style.display = "block";
}

// Initial load with cache check
const cached = localStorage.getItem("products");

if (cached) {
  renderProducts(JSON.parse(cached));
} else {
  fetchProducts();  // first-time load
}



// Auto-load products on page load
window.addEventListener("DOMContentLoaded", () => {
  const cached = localStorage.getItem("products");

  if (cached) {
    renderProducts(JSON.parse(cached));
  } else {
    fetchProducts();
  }
});


card.addEventListener("click", () => {
  window.location.href = `product.html?id=${product.id}`;
});


function renderProduct(product) {
  detailContainer.innerHTML = `
    <div class="product-wrapper">

      <div class="product-images">
        <img id="mainImage" src="${product.image}" alt="${product.title}">
      </div>

      <div class="product-info">
        <h1>${product.title}</h1>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="description">${product.description}</p>

        <div class="variation-box">
          <label>Size:</label>
          <select id="sizeSelect">
            <option>S</option>
            <option>M</option>
            <option>L</option>
          </select>
        </div>

        <div class="quantity-box">
          <button id="minusBtn">−</button>
          <span id="qty">1</span>
          <button id="plusBtn">+</button>
        </div>

        <button class="add-cart-btn" id="addToCartBtn">
          Add to Cart
        </button>
      </div>
    </div>
  `;

  setupQuantityButtons();
  setupAddToCart(product);
  enableImageZoom();
  //updateDynamicPrice(product.price);
}


function setupAddToCart(product) {
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const size = document.getElementById("sizeSelect").value;
    const quantity = parseInt(document.getElementById("qty").innerText);

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: size,
      qty: quantity
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cartItem);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    alert("Added to Cart!");
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  document.getElementById("cartCount").innerText = cart.length;
}

updateCartCount();

function setupQuantityButtons() {
  const qty = document.getElementById("qty");
  const plus = document.getElementById("plusBtn");
  const minus = document.getElementById("minusBtn");

  plus.addEventListener("click", () => {
    qty.innerText = parseInt(qty.innerText) + 1;
  });

  minus.addEventListener("click", () => {
    if (qty.innerText > 1) {
      qty.innerText = parseInt(qty.innerText) - 1;
    }
  });
}


function enableImageZoom() {
  const img = document.getElementById("mainImage");

  img.addEventListener("mousemove", function (e) {
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    img.style.transform = "scale(1.8)";
    img.style.transformOrigin = `${x}% ${y}%`;
  });

  img.addEventListener("mouseleave", function () {
    img.style.transform = "scale(1)";
  });
}

// function updateDynamicPrice(basePrice) {
//   const qty = document.getElementById("qty");
//   const priceEl = document.querySelector(".price");

//   qty.addEventListener("DOMSubtreeModified", () => {
//     const qtyValue = parseInt(qty.innerText);
//     const totalPrice = (basePrice * qtyValue).toFixed(2);
//     priceEl.innerText = "$" + totalPrice;
//   });
// }
