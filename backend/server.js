// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ensure files exist
if (!fs.existsSync(CARTS_FILE)) fs.writeFileSync(CARTS_FILE, JSON.stringify({}));
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, JSON.stringify([]));

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Get cart for user
app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const carts = readJson(CARTS_FILE);
  res.json({ userId, cart: carts[userId] || {} });
});

// Save/replace cart for user
app.post('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  const cart = req.body.cart || {};
  const carts = readJson(CARTS_FILE);
  carts[userId] = cart;
  writeJson(CARTS_FILE, carts);
  res.json({ ok: true, userId });
});

// Checkout - create order and optionally clear cart
app.post('/api/checkout', (req, res) => {
  try {
    const { userId, customer, cart, clearCart = true } = req.body;
    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const orders = readJson(ORDERS_FILE);
    const orderId = uuidv4();
    const createdAt = new Date().toISOString();

    // compute subtotal
    let subtotal = 0;
    const items = Object.values(cart);
    items.forEach(it => subtotal += (it.price * it.qty));

    const order = {
      orderId,
      userId: userId || null,
      customer,
      items,
      subtotal,
      createdAt
    };
    orders.push(order);
    writeJson(ORDERS_FILE, orders);

    // optionally clear saved cart for user
    if (userId && clearCart) {
      const carts = readJson(CARTS_FILE);
      delete carts[userId];
      writeJson(CARTS_FILE, carts);
    }

    res.json({ ok: true, orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// debug: list orders
app.get('/api/orders', (req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json(orders);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
