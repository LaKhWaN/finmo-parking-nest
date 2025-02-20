# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the project
RUN npm run build

# Expose port (same as your NestJS app, usually 3000)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
