require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { register, httpRequestsTotal, httpRequestDurationSeconds } = require('./metrics');

const app = express();
app.use(cors());
app.use(express.json());


// Canary v2 fault injection — remove this in v1
app.use((req, res, next) => {
  if (process.env.APP_VERSION === 'v2' && Math.random() < 0.20) {
    return res.status(500).json({ error: 'Simulated canary failure' });
  }
  next();
});

// simple middleware to observe duration and count
app.use((req, res, next) => {
  const routeLabel = req.baseUrl && req.route && req.route.path ? `${req.baseUrl}${req.route.path}` : req.path;
  const end = httpRequestDurationSeconds.startTimer({ method: req.method, route: routeLabel });
  res.on('finish', () => {
    httpRequestsTotal.inc({ method: req.method, route: routeLabel, status_code: res.statusCode });
    end({ method: req.method, route: routeLabel });
  });
  next();
});





app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
