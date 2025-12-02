# -------- BUILD STAGE --------
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only backend folder
COPY backend/pom.xml .
COPY backend/src ./src

# Build the Spring Boot JAR
RUN mvn -B -DskipTests clean package


# -------- RUN STAGE --------
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy built jar
COPY --from=build /app/target/*.jar app.jar

# Render sets PORT env var
ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
