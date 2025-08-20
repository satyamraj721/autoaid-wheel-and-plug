/**
 * AUTOAID 360 - Health Check Routes
 * System status and health monitoring endpoints
 */

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/', (req, res) => {
  const uptime = process.uptime();
  const timestamp = new Date().toISOString();
  
  // Format uptime for readability
  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  res.status(200).json({
    success: true,
    message: 'AUTOAID 360 API is running smoothly',
    data: {
      status: 'healthy',
      timestamp,
      uptime: formatUptime(uptime),
      uptimeSeconds: Math.floor(uptime),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch
    }
  });
});

/**
 * GET /api/health/detailed
 * Detailed system health with database connection status
 */
router.get('/detailed', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Test database query
    let dbQueryTime = null;
    let dbQueryStatus = 'unknown';
    
    if (dbStatus === 1) {
      const queryStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbQueryTime = Date.now() - queryStart;
      dbQueryStatus = 'responsive';
    }

    // Memory usage
    const memoryUsage = process.memoryUsage();
    const formatBytes = (bytes) => {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    // Response time
    const responseTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      message: 'Detailed system health report',
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        server: {
          uptime: Math.floor(process.uptime()),
          environment: process.env.NODE_ENV || 'development',
          nodeVersion: process.version,
          platform: process.platform,
          pid: process.pid
        },
        database: {
          status: dbStates[dbStatus] || 'unknown',
          queryTime: dbQueryTime ? `${dbQueryTime}ms` : null,
          queryStatus: dbQueryStatus,
          host: mongoose.connection.host,
          name: mongoose.connection.name
        },
        memory: {
          used: formatBytes(memoryUsage.heapUsed),
          total: formatBytes(memoryUsage.heapTotal),
          external: formatBytes(memoryUsage.external),
          rss: formatBytes(memoryUsage.rss)
        },
        services: {
          api: 'operational',
          auth: 'operational',
          database: dbStatus === 1 ? 'operational' : 'degraded'
        }
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(503).json({
      success: false,
      message: 'System health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        services: {
          api: 'operational',
          auth: 'unknown',
          database: 'error'
        }
      }
    });
  }
});

/**
 * GET /api/health/ready
 * Kubernetes readiness probe endpoint
 */
router.get('/ready', async (req, res) => {
  try {
    // Check critical dependencies
    const isDbReady = mongoose.connection.readyState === 1;
    
    if (!isDbReady) {
      throw new Error('Database not ready');
    }

    // Quick database ping
    await mongoose.connection.db.admin().ping();

    res.status(200).json({
      success: true,
      message: 'Service is ready',
      ready: true
    });

  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service is not ready',
      ready: false,
      error: error.message
    });
  }
});

/**
 * GET /api/health/live
 * Kubernetes liveness probe endpoint
 */
router.get('/live', (req, res) => {
  // Simple liveness check - if we can respond, we're alive
  res.status(200).json({
    success: true,
    message: 'Service is alive',
    alive: true,
    timestamp: new Date().toISOString()
  });
});

export default router;