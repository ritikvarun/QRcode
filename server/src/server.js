import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedAdminIfEmpty } from './services/store.service.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and seed default admin
const initialize = async () => {
  await connectDB();
  await seedAdminIfEmpty();
};

initialize();

const server = app.listen(PORT, () => {
  console.log(`🚀 [Server Ready] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔗 Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Public QR redirect at: http://localhost:${PORT}/q/:qrId`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ [Unhandled Rejection]: ${err.message}`);
});

// Handle SIGTERM/SIGINT for clean shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
