# Docker Setup File
FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install -g nodemon
RUN npm install

# For production only
# RUN npm ci --only=production

# Copy source code
COPY . .

# Expose API port to the outside
EXPOSE 8080

# Launch application
CMD [ "node", "server.js" ]