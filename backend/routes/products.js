const express = require('express');
const router = express.Router();
const { productFetchErrorsTotal } = require('../metrics');

const PRODUCTS = [
  { id: 'p1', name: 'Wireless Headphones', category: 'Electronics', price: 79.99, description: 'Comfortable wireless headphones with long battery life.', imageUrl: 'https://placehold.co/300x200?text=Wireless+Headphones', stock: 25 },
  { id: 'p2', name: 'Mechanical Keyboard', category: 'Electronics', price: 129.99, description: 'Tactile mechanical keyboard with customizable RGB.', imageUrl: 'https://placehold.co/300x200?text=Mechanical+Keyboard', stock: 15 },
  { id: 'p3', name: 'USB-C Hub', category: 'Electronics', price: 39.99, description: 'Compact USB-C hub with multiple ports for laptops.', imageUrl: 'https://placehold.co/300x200?text=USB-C+Hub', stock: 40 },
  { id: 'p4', name: 'Webcam HD', category: 'Electronics', price: 59.99, description: '1080p webcam with built-in microphone for clear calls.', imageUrl: 'https://placehold.co/300x200?text=Webcam+HD', stock: 30 },
  { id: 'p5', name: 'Running Shoes', category: 'Clothing', price: 89.99, description: 'Lightweight running shoes designed for comfort.', imageUrl: 'https://placehold.co/300x200?text=Running+Shoes', stock: 20 },
  { id: 'p6', name: 'Denim Jacket', category: 'Clothing', price: 69.99, description: 'Classic denim jacket with a modern fit.', imageUrl: 'https://placehold.co/300x200?text=Denim+Jacket', stock: 10 },
  { id: 'p7', name: 'Yoga Pants', category: 'Clothing', price: 44.99, description: 'Stretchy and breathable yoga pants.', imageUrl: 'https://placehold.co/300x200?text=Yoga+Pants', stock: 35 },
  { id: 'p8', name: 'Cotton T-Shirt', category: 'Clothing', price: 19.99, description: 'Soft cotton t-shirt available in multiple colors.', imageUrl: 'https://placehold.co/300x200?text=Cotton+T-Shirt', stock: 50 },
  { id: 'p9', name: 'Clean Code', category: 'Books', price: 34.99, description: 'A handbook of agile software craftsmanship.', imageUrl: 'https://placehold.co/300x200?text=Clean+Code', stock: 12 },
  { id: 'p10', name: 'The Pragmatic Programmer', category: 'Books', price: 39.99, description: 'Timeless advice for software developers.', imageUrl: 'https://placehold.co/300x200?text=The+Pragmatic+Programmer', stock: 8 },
  { id: 'p11', name: 'Designing Data-Intensive Applications', category: 'Books', price: 49.99, description: 'Comprehensive guide to data systems and architectures.', imageUrl: 'https://placehold.co/300x200?text=Designing+Data-Intensive+Applications', stock: 7 },
  { id: 'p12', name: 'JavaScript: The Good Parts', category: 'Books', price: 24.99, description: 'A deep dive into the best parts of JavaScript.', imageUrl: 'https://placehold.co/300x200?text=JavaScript:+The+Good+Parts', stock: 18 }
];

function randomDelay(min = 50, max = 300) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

router.get('/', async (req, res) => {
  try {
    await randomDelay(50, 300);
    const { search, category } = req.query;
    let results = PRODUCTS.slice();
    if (category) {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const term = search.toLowerCase();
      results = results.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    }
    res.json(results);
  } catch (err) {
    productFetchErrorsTotal.inc({ error_type: 'server_error' });
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    await randomDelay(50, 200);
    const p = PRODUCTS.find(x => x.id === req.params.id);
    if (!p) {
      productFetchErrorsTotal.inc({ error_type: 'not_found' });
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(p);
  } catch (err) {
    productFetchErrorsTotal.inc({ error_type: 'server_error' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
module.exports.PRODUCTS = PRODUCTS;
