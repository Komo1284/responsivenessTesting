# Use the openjdk:17-jdk-slim base image
FROM openjdk:17-jdk-slim

# Set the working directory to /app
WORKDIR /app

# Copy the JAR file into the container
COPY build/libs/*.jar app.jar

# Copy the static resources into the container
COPY src/main/resources/static /app/static

# Expose the port that the application is running on
EXPOSE 8080

# Set the command to run the Spring Boot application
CMD ["java", "-jar", "app.jar"]