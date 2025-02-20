# 1️⃣ Use official Node.js image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy all project files
COPY . .

# 6️⃣ Build the project
RUN npm run build

# 7️⃣ Expose port (same as your NestJS app, usually 3000)
EXPOSE 3000

# 8️⃣ Start the app
CMD ["npm", "run", "start:dev"]
