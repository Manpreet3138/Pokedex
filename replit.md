# Java Pokédex

## Overview

This is a full-stack Pokédex application that allows users to search for Pokémon by name or ID. The backend is built with Java and Spring Boot, serving as a proxy/cache layer to the public PokéAPI. The frontend is a vanilla JavaScript single-page application with a modern, dark-themed UI. The application implements an in-memory LRU cache with TTL expiration to optimize API calls and reduce load on the external PokéAPI service.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture

**Framework**: Spring Boot (Java)
- **Purpose**: Provides a REST API that acts as a caching proxy to PokéAPI
- **Rationale**: Spring Boot offers robust dependency injection, built-in REST support, and easy configuration management. Java provides type safety and reliability for the backend service.
- **Key endpoints**:
  - `GET /api/pokemon/{nameOrId}` - Fetches Pokémon data
  - `GET /api/pokemon/health` - Health check endpoint

**Caching Strategy**: In-memory LRU cache with TTL
- **Problem**: Reduce latency and external API calls to PokéAPI
- **Solution**: Implemented an LRU (Least Recently Used) cache with time-to-live expiration
- **Configuration**: Cache parameters are configurable via `application.yml`:
  - `maxEntries` - Maximum number of cached entries
  - `ttlMillis` - Time-to-live for cached entries in milliseconds
- **Tradeoffs**: Memory usage vs. performance/API rate limits

### Frontend Architecture

**Technology**: Vanilla JavaScript with HTML5 and CSS3
- **Purpose**: Simple, dependency-free single-page application
- **Rationale**: No build step required, easy to deploy and modify. Sufficient for the application's requirements without framework overhead.
- **Features**:
  - Real-time search with Enter key support
  - Support for multiple comma-separated Pokémon searches
  - Error handling for failed API requests
  - Loading states for better UX

**Communication**: RESTful API calls to backend
- Uses the Fetch API for asynchronous HTTP requests
- Implements parallel fetching with `Promise.all()` for multiple Pokémon queries
- Error handling for network failures and 404 responses

### Development Server

**Proxy Server**: Python HTTP server (`server.py`)
- **Purpose**: Serves frontend static files and proxies API requests during development
- **Rationale**: Avoids CORS issues during local development by proxying `/api/*` requests to the Java backend
- **Port**: Runs on port 5000
- **Features**:
  - Serves static files from `frontend/` directory
  - Proxies `/api/*` requests to `http://localhost:8080`
  - Adds CORS headers for cross-origin support
  - Implements cache control headers to prevent caching during development

### Deployment Architecture

**Backend**: Standalone Spring Boot application
- Packaged as executable JAR using Maven
- Runs on port 8080 by default
- Can be deployed to any Java-compatible hosting environment

**Frontend**: Static file hosting
- Can be opened directly in a browser (for simple use cases)
- Production deployment would use the Python proxy or a proper reverse proxy (nginx, Apache)

## External Dependencies

### Third-Party APIs

**PokéAPI** (`https://pokeapi.co`)
- **Purpose**: Source of all Pokémon data (names, IDs, sprites, stats, types, abilities)
- **Integration**: Backend makes HTTP requests to PokéAPI and caches responses
- **Rate Limiting**: Handled through in-memory caching to minimize API calls

### Build Tools and Frameworks

**Maven**
- **Purpose**: Java dependency management and build automation
- **Usage**: Building the Spring Boot application (`mvn clean package`)

**Spring Boot**
- **Purpose**: Backend framework for REST API development
- **Components likely used**:
  - Spring Web (REST endpoints)
  - Spring Boot Actuator (health checks)
  - Configuration properties management

### Runtime Dependencies

**Java Runtime Environment**
- Required version: Compatible with Spring Boot (likely Java 11+)
- Executes the compiled JAR file

**Python 3**
- Used for the development proxy server
- Standard library modules: `http.server`, `socketserver`, `urllib`

### No Database

This application does not use a persistent database. All data is:
- Fetched from PokéAPI on-demand
- Cached in-memory temporarily
- Lost on application restart (by design, as Pokémon data changes infrequently)