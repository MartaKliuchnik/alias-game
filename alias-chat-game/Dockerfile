# This Dockerfile allows to build a Docker image of the NestJS application
# and based on a NodeJS 20 image. 

#Create image based uses a lightweight Node.js image
FROM node:20-alpine

# Set the working directory 
WORKDIR /app

# Copy dependency definitions (package.json and package-lock.json)
COPY package*.json ./

# Install production dependencies (excluding dev dependencies)
# RUN npm install --only=production

# Install dependencies 
RUN npm install 

# Get all the code needed to run the app
COPY . .

# Build the Nest.js application
RUN npm run build

# Expose the port the app runs in
EXPOSE 8080

# Start the application (for development environment)
CMD ["npm", "run", "start:prod"]

# Start the application (for production-ready application)
# CMD ["node", "dist/main"]

