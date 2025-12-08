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
