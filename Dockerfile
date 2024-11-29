FROM --platform=linux/amd64 eclipse-temurin:17-jre
WORKDIR /app

# Copy pre-built jar file
COPY build/libs/*.jar app.jar

# Environment variables for PostgreSQL connection
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://14.63.160.46:5432/reaction-ranking
ENV SPRING_DATASOURCE_USERNAME=eztake
ENV SPRING_DATASOURCE_PASSWORD=ezta1104

# Port exposure
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]