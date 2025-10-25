#!/usr/bin/env node

/**
 * Single Server Startup - Wichita to the Moon
 * Runs both Frontend (Next.js) and Backend (Express API) in one process
 */

const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 8080;

console.log('🚀 Starting Wichita to the Moon Server...');
console.log(`📍 Port: ${PORT}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log('');

// Start Backend API on port 3001
console.log('🔧 Starting Backend API...');
const backend = spawn('node', ['backend/src/server.js'], {
  env: {
    ...process.env,
    PORT: '3001',
    FRONTEND_URL: `http://localhost:${PORT}`
  },
  stdio: 'inherit'
});

// Start Frontend Next.js on main port
setTimeout(() => {
  console.log('🎮 Starting Frontend...');
  const frontend = spawn('node', ['frontend/server.js'], {
    env: {
      ...process.env,
      PORT: PORT,
      HOSTNAME: '0.0.0.0',
      NEXT_PUBLIC_API_URL: 'http://localhost:3001'
    },
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('❌ Frontend error:', err);
    process.exit(1);
  });

  frontend.on('exit', (code) => {
    console.log(`Frontend exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
  process.exit(1);
});

backend.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Shutting down gracefully...');
  backend.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Shutting down gracefully...');
  backend.kill();
  process.exit(0);
});

console.log('');
console.log('✅ Server started successfully!');
console.log(`🌐 Access the game at http://localhost:${PORT}`);
console.log('');
