# Use an official nginx image to serve the React app
FROM nginx:latest

# Copy build files to nginx's html directory
COPY build/ /usr/share/nginx/html

# Expose port 80 to the AWS environment
EXPOSE 80

# Start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
