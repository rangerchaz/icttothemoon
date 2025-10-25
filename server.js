#!/usr/bin/env node

/**
 * Unified Server - Wichita to the Moon
 * Single Express server handling both API and Frontend
 */

const express = require('express');
const next = require('next');
const path = require('path');
const cors = require('cors');

const PORT = parseInt(process.env.PORT || '8080', 10);
const dev = process.env.NODE_ENV !== 'production';

// Initialize Next.js
const app = next({
  dev,
  dir: path.join(__dirname, 'frontend'),
  conf: {
    distDir: '.next'
  }
});

const handle = app.getRequestHandler();

// Import backend routes
const createBackendApp = async () => {
  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());

  // Request logging
  server.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Health check
  server.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'wichita-moon-game'
    });
  });

  // Backend API routes
  const npcRoutes = require('./backend/src/routes/npc.js');
  server.use('/api/npc', npcRoutes.default || npcRoutes);

  // Prepare Next.js
  await app.prepare();

  // Next.js handles all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  return server;
};

// Start server
createBackendApp()
  .then((server) => {
    server.listen(PORT, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log('');
      console.log('🚀 Wichita to the Moon - Server Started!');
      console.log('==========================================');
      console.log(`🌐 URL:          http://localhost:${PORT}`);
      console.log(`📡 API:          http://localhost:${PORT}/api`);
      console.log(`🏥 Health:       http://localhost:${PORT}/health`);
      console.log(`🌍 Environment:  ${process.env.NODE_ENV || 'development'}`);
      console.log(`🤖 AI API:       ${process.env.ANTHROPIC_API_KEY ? 'Configured ✓' : 'NOT CONFIGURED ✗'}`);
      console.log('==========================================');
      console.log('');
    });
  })
  .catch((err) => {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  });

// Graceful shutdown
const shutdown = () => {
  console.log('\n📴 Shutting down gracefully...');
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
