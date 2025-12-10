# Use Debian-based Node
FROM node:20-bullseye

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Force Rollup to skip native binaries
ENV ROLLUP_JUST_JAVASCRIPT=true

# Clean install dependencies
RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps --ignore-optional

# Copy app source
COPY . .

# Build the frontend
RUN npm run build

EXPOSE 5173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "5173"]
