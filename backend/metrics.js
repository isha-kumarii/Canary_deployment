const client = require('prom-client');

const register = new client.Registry();
register.setDefaultLabels({ app: 'ecommerce_backend' });
client.collectDefaultMetrics({ register, prefix: 'ecommerce_' });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
});

const cartAdditionsTotal = new client.Counter({
  name: 'cart_additions_total',
  help: 'Total cart additions',
  labelNames: ['user']
});

const productFetchErrorsTotal = new client.Counter({
  name: 'product_fetch_errors_total',
  help: 'Product fetch errors',
  labelNames: ['error_type']
});

const activeSessions = new client.Gauge({
  name: 'active_sessions',
  help: 'Number of active sessions'
});

const loginAttemptsTotal = new client.Counter({
  name: 'login_attempts_total',
  help: 'Login attempts',
  labelNames: ['result']
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(cartAdditionsTotal);
register.registerMetric(productFetchErrorsTotal);
register.registerMetric(activeSessions);
register.registerMetric(loginAttemptsTotal);

module.exports = {
  client,
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  cartAdditionsTotal,
  productFetchErrorsTotal,
  activeSessions,
  loginAttemptsTotal
};
