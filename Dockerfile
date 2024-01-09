# Use Node.js image from Docker Hub
FROM node:20

# Create app directory in Docker
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install packages
RUN npm install

# Copy app from local source to Docker
COPY . .

EXPOSE 3000

# Run the application
CMD [ "node", "dist/app.js" ]