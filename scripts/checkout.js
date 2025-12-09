// scripts/checkout.js
const API_BASE = 'http://localhost:4000'; // change if backend host/port differ
const CART_KEY = 'shopease_cart';
const GUEST_KEY = 'shopease_guestid';

// ensure guest id
function getOrCreateGuestId() {
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2, 12);
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}

function getCartLocal() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; } catch { return {}; }
}
function saveCartLocal(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateHeaderCount(); }
function updateHeaderCount() {
  const el = document.querySelector('.cart-count');
  if (!el) return;
  const c = getCartLocal();
  const count = Object.values(c).reduce((s, it) => s + (it.qty || 0), 0);
  el.textContent = count;
}

// Sync with backend: try to fetch server cart and merge
async function syncCartFromServer() {
  const uid = getOrCreateGuestId();
  try {
    const res = await fetch(`${API_BASE}/api/cart/${uid}`);
    if (!res.ok) return;
    const j = await res.json();
    const serverCart = j.cart || {};
    const localCart = getCartLocal();

    // simple merge: server entries win, then local entries added if new
    const merged = { ...localCart, ...serverCart };
    saveCartLocal(merged);

    // post merged cart back to server to keep both in sync
    await fetch(`${API_BASE}/api/cart/${uid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: merged })
    });
  } catch (err) {
    console.warn('Cart sync failed', err);
  }
}

function renderOrderSummary() {
  const cart = getCartLocal();
  const container = document.getElementById('orderSummary');
  container.innerHTML = '';
  let subtotal = 0;
  if (!container) return;
  const items = Object.values(cart);
  if (items.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'summary-item';
      div.innerHTML = `<span>${escapeHtml(it.title)} x ${it.qty}</span><span>$${(it.price * it.qty).toFixed(2)}</span>`;
      container.appendChild(div);
      subtotal += it.price * it.qty;
    });
  }
  document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  updateHeaderCount();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// Place order
document.addEventListener('DOMContentLoaded', async () => {
  // sync cart from server when opening checkout
  await syncCartFromServer();
  renderOrderSummary();

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const customer = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      address: fd.get('address')
    };
    const cart = getCartLocal();
    if (!cart || Object.keys(cart).length === 0) {
      alert('Your cart is empty.');
      return;
    }
    const userId = getOrCreateGuestId();

    // call backend
    try {
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, customer, cart, clearCart: true })
      });
      const j = await res.json();
      if (res.ok && j.ok) {
        // clear local cart
        localStorage.removeItem(CART_KEY);
        updateHeaderCount();
        alert('Order placed! Order ID: ' + j.orderId);
        window.location.href = 'index.html';
      } else {
        alert('Checkout failed: ' + (j.error || 'unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error while placing order.');
    }
  });
});
