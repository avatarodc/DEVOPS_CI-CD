const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route   GET /api/health
 * @desc    Health check endpoint pour Kubernetes
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    const dbState = mongoose.connection.readyState;
    
    if (dbState === 1) {
      return res.status(200).json({
        status: 'OK',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(503).json({
        status: 'ERROR',
        database: 'disconnected',
        dbState: dbState,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Health check failed:', err);
    return res.status(500).json({
      status: 'ERROR',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/health/deep
 * @desc    Deep health check endpoint pour les diagnostics
 * @access  Public
 */
router.get('/deep', async (req, res) => {
  try {
    // Vérifier la connexion à la base de données
    const dbState = mongoose.connection.readyState;
    let dbStatus = 'disconnected';
    let memoryUsage = process.memoryUsage();
    
    if (dbState === 1) {
      dbStatus = 'connected';
      // Effectuez une requête simple pour tester la base de données
      try {
        await mongoose.connection.db.admin().ping();
      } catch (dbErr) {
        dbStatus = 'error: ' + dbErr.message;
      }
    }
    
    return res.status(200).json({
      status: 'OK',
      version: process.env.npm_package_version || 'unknown',
      database: {
        status: dbStatus,
        state: dbState
      },
      system: {
        uptime: process.uptime(),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB'
        },
        node: process.version
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Deep health check failed:', err);
    return res.status(500).json({
      status: 'ERROR',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;