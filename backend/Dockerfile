FROM node:20-alpine

WORKDIR /app

# Copy cả package.json và lock file
COPY package*.json ./

# Install dependency chuẩn CI
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]