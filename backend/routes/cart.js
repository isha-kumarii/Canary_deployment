const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { cartAdditionsTotal } = require('../metrics');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// In-memory carts per username
const carts = {};

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

router.post('/', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body || {};
  if (!productId || !quantity) return res.status(400).json({ error: 'productId and quantity required' });
  const username = req.user.username;
  const cart = carts[username] || [];
  const existing = cart.find(i => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  carts[username] = cart;
  cartAdditionsTotal.inc({ user: username });
  res.json({ cart });
});

router.get('/', authMiddleware, (req, res) => {
  const username = req.user.username;
  const cart = carts[username] || [];
  const prodModule = require('./products');
  const PRODUCTS = prodModule.PRODUCTS || [];
  // build detailed cart with prices
  const detailed = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.productId) || { name: 'Unknown', price: 0 };
    return {
      productId: item.productId,
      name: p.name,
      quantity: item.quantity,
      unitPrice: p.price,
      lineTotal: +(p.price * item.quantity).toFixed(2)
    };
  });
  const total = detailed.reduce((s, it) => s + it.lineTotal, 0);
  res.json({ cart: detailed, total: +total.toFixed(2) });
});

router.delete('/:productId', authMiddleware, (req, res) => {
  const username = req.user.username;
  const productId = req.params.productId;
  const cart = carts[username] || [];
  const updated = cart.filter(i => i.productId !== productId);
  carts[username] = updated;
  res.json({ cart: updated });
});

module.exports = router;
