import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import profileRoutes from './routes/profile.routes.js';
import cropRoutes from './routes/crop.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import chatRoutes from './routes/chat.routes.js';
import guideRoutes from './routes/guide.routes.js';
import adminRoutes from './routes/admin.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false // Allow inline scripts/styles for local UI rendering
}));

// CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// Request logging
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Too many requests from this IP address, please try again in a few minutes.'
  }
});
app.use('/api/', generalLimiter);

// AI Specific Rate Limiter (to manage token budgets responsibly)
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: env.AI_MAX_REQUESTS_PER_MINUTE || 20,
  message: {
    success: false,
    message: 'AI advisory rate limit reached for this minute. Please wait a moment.'
  }
});
app.use('/api/v1/ai/', aiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'HEALTHY',
    service: 'AgriSmart AI Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API v1 Routes
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1', cropRoutes);
app.use('/api/v1', advisoryRoutes);
app.use('/api/v1', diseaseRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/ai', chatRoutes);
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/admin', adminRoutes);

// Serve static frontend assets from client/dist
app.use(express.static(clientDistPath));

// For any non-API route, fallback to index.html (SPA routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
    error: { code: 'NOT_FOUND' }
  });
});

// Centralized error handling
app.use(errorHandler);

export default app;
