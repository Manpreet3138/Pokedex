# Use Java 17
FROM eclipse-temurin:17-jdk

# Set working dir
WORKDIR /app

# Copy Maven project
COPY . .

# Build JAR
RUN ./mvnw -B -DskipTests clean package

# Expose port
EXPOSE 8080

# Run the jar
CMD ["java", "-jar", "target/pokedex-0.0.1-SNAPSHOT.jar"]
