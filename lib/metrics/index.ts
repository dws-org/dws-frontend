import { Counter, Histogram, register } from 'prom-client';

// Prevent duplicate metric registration in development (hot reload)
register.clear();

// HTTP request counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status', 'service'],
  registers: [register],
});

// HTTP request duration
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'path', 'service'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register],
});

// Page views counter
export const pageViews = new Counter({
  name: 'page_views_total',
  help: 'Total number of page views',
  labelNames: ['path', 'service'],
  registers: [register],
});

// API calls counter
export const apiCalls = new Counter({
  name: 'api_calls_total',
  help: 'Total number of API calls',
  labelNames: ['endpoint', 'method', 'status', 'service'],
  registers: [register],
});

export { register };
