// scripts/cart.js
const CART_KEY = 'shopease_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateHeaderCount();
}

// Update header cart count
function updateHeaderCount() {
  const cart = getCart();
  const totalCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  const el = document.querySelector('.cart-count');
  if (el) el.textContent = totalCount;
}

function renderCartItems() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  container.innerHTML = '';

  if (Object.keys(cart).length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    updateSummary(0, 0);
    return;
  }

  let subtotal = 0;
  let totalItems = 0;

  Object.values(cart).forEach(item => {
    subtotal += item.price * item.qty;
    totalItems += item.qty;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.image}" alt="${escapeHtml(item.title)}" />
      <div class="cart-item-details">
        <h3>${escapeHtml(item.title)}</h3>
        <p class="price">$${Number(item.price).toFixed(2)}</p>
        <div class="qty-controls">
          <button class="decrease" data-id="${item.id}">−</button>
          <span class="qty">${item.qty}</span>
          <button class="increase" data-id="${item.id}">+</button>
          <button class="remove" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(itemEl);
  });

  updateSummary(totalItems, subtotal);
  attachCartListeners();
}

function updateSummary(items, subtotal) {
  document.getElementById('summaryItems').textContent = items;
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
}

// event wiring for + / - / remove
function attachCartListeners() {
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      if (cart[id]) {
        cart[id].qty += 1;
        saveCart(cart);
        renderCartItems();
      }
    });
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      if (cart[id]) {
        cart[id].qty = Math.max(1, cart[id].qty - 1);
        saveCart(cart);
        renderCartItems();
      }
    });
  });

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const cart = getCart();
      if (cart[id]) {
        delete cart[id];
        saveCart(cart);
        renderCartItems();
      }
    });
  });
}

// Clear cart button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clearCartBtn').addEventListener('click', () => {
    localStorage.removeItem(CART_KEY);
    renderCartItems();
  });

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert('Proceeding to checkout (demo).');
    // in real flow, redirect to checkout page
  });

  renderCartItems();
  updateHeaderCount();
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];});
}
