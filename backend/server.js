const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const client = require('prom-client');
const healthRoutes = require('./routes/healthRoutes');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger en mode développement uniquement
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_etablissement')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Importer les routes
const etudiantsRoutes = require('./routes/etudiantsRoutes');
const coursRoutes = require('./routes/coursRoutes');
const professeurRoutes = require('./routes/professeurRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const classRoutes = require('./routes/classRoutes');

// Routes API
app.use('/api/etudiants', etudiantsRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/professeurs', professeurRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/classes', classRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

app.use('/api/health', healthRoutes);

// Prometheus metrics (reste inchangé de votre fichier original)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  registers: [register]
});

// Middleware pour collecter les métriques
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const route = req.route ? req.route.path : req.path;
    const method = req.method;
    const status = res.statusCode;
    
    httpRequestsTotal.inc({ method, route, status });
    
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    httpRequestDurationMicroseconds.observe({ method, route, status }, durationInSeconds);
  });
  
  next();
});

// Endpoint des métriques Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  });
}

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// Configuration du port
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
});

// Gestion propre de l'arrêt pour les conteneurs Docker
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Export pour les tests
module.exports = { app, server };