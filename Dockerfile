# Use an official Node.js image as the base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /buget-app-client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the React app
RUN npm run build

# Use an Nginx image to serve the built React app
FROM nginx:alpine

# Copy the built app from the previous stage to Nginx's serving directory
COPY --from=build /buget-app-client/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
