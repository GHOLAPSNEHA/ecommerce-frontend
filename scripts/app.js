// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.style.display =
    navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Smooth scroll to products section
document.querySelector('.cta-btn').addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('#products').scrollIntoView({
    behavior: 'smooth'
  });
});

//const productGrid = document.getElementById('productGrid');

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
//-----------

// scripts/app.js
const productGrid = document.getElementById('productGrid');
const CART_KEY = 'shopease_cart';

//Utility: get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();

  // background: save cart to backend (best-effort)
  try {
    const userId = localStorage.getItem('shopease_guestid') || ('guest_' + Math.random().toString(36).slice(2,10));
    if (!localStorage.getItem('shopease_guestid')) localStorage.setItem('shopease_guestid', userId);
    fetch('http://localhost:4000/api/cart/' + userId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart })
    }).catch(err => console.warn('Failed to sync cart to server', err));
  } catch(e){
    console.warn('Cart sync skipped', e);
  }
}


// Update header cart count
function updateCartCount() {
  const cartCountEl = document.querySelector('.cart-count');
  const cart = getCart();
  const totalCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalCount;
}

// Add product to cart (or increase qty)
function addToCart(product) {
  const cart = getCart();
  if (cart[product.id]) {
    cart[product.id].qty += 1;
  } else {
    cart[product.id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      qty: 1
    };
  }
  saveCart(cart);
  // small visual feedback
  const btn = document.querySelector(`button[data-id="${product.id}"]`);
  if (btn) {
    btn.textContent = 'Added ✓';
    setTimeout(() => btn.textContent = 'Add to Cart', 900);
  }
}

// Render product cards
async function loadProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy">
        <h3>${escapeHtml(squeezeTitle(p.title, 60))}</h3>
        <p>$${Number(p.price).toFixed(2)}</p>
        <button class="add-btn" data-id="${p.id}">Add to Cart</button>
      `;
      productGrid.appendChild(card);
    });

    // attach add-to-cart listeners
    document.querySelectorAll('.add-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        // find product data (re-fetch single product for reliable data)
        try {
          const response = await fetch(`https://fakestoreapi.com/products/${id}`);
          const product = await response.json();
          addToCart(product);
        } catch (err) {
          console.error('Failed to add product', err);
        }
      });
    });

  } catch (error) {
    console.error('Error loading products:', error);
    if (productGrid) productGrid.innerHTML = '<p>Failed to load products.</p>';
  } finally {
    updateCartCount();
  }
}

// small helpers
function squeezeTitle(s, len=50) {
  return s.length > len ? s.slice(0,len-1) + '…' : s;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];});
}

// init
document.addEventListener('DOMContentLoaded', () => {
  if (productGrid) loadProducts();
  updateCartCount();
});


card.addEventListener("click", () => {
  window.location.href = `product.html?id=${product.id}`;
});
