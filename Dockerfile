FROM node:16-alpine

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY backend/package*.json ./
RUN npm install --production

# Copier le reste du code backend
COPY backend/ ./

# Créer le dossier public si nécessaire
RUN mkdir -p public

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5000

# Commande pour démarrer l'application
CMD ["node", "server.js"]