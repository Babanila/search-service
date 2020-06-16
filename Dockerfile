# Docker Setup File
FROM node:12.13.0-alpine

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose API port to the outside
EXPOSE 8080

# Launch application
CMD [ "node", "server.js" ]
