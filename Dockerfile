# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /index1

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port that the application will run on
EXPOSE 4000

# Start the application
CMD [ "node", "index1.js" ]