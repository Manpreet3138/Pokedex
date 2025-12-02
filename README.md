# Java Pokédex
#live :- https://manpreet3138.github.io/Pokedex/
## Overview

This is a full-stack Pokédex application that allows users to search for Pokémon by name or ID. The backend is built with Java and Spring Boot, serving as a proxy/cache layer to the public PokéAPI. The frontend is a vanilla JavaScript single-page application with a modern, dark-themed UI with a Pokémon background. The application implements an in-memory LRU cache with TTL expiration to optimize API calls and reduce load on the external PokéAPI service.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (November 25, 2025)

- Added image download feature: Users can download official Pokémon artwork to their device
- Reduced box opacity to 50% for better background visibility
- Added Pokémon background image (collage with Ash, Pikachu, and various Pokémon)
- Implemented multi-Pokémon search (comma-separated names/IDs)
- Removed subtitle and hint text lines for cleaner UI
- Changed "Pokédex" title to dark blue

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
  - `maxEntries` - Maximum number of cached entries (default: 200)
  - `ttlMillis` - Time-to-live for cached entries in milliseconds (default: 600000 / 10 minutes)
- **Tradeoffs**: Memory usage vs. performance/API rate limits

### Frontend Architecture

**Technology**: Vanilla JavaScript with HTML5 and CSS3
- **Purpose**: Simple, dependency-free single-page application
- **Rationale**: No build step required, easy to deploy and modify. Sufficient for the application's requirements without framework overhead.
- **Features**:
  - Multi-Pokémon search with comma-separated input (e.g., "pikachu, charizard, 25")
  - Real-time search with Enter key support
  - Error handling for failed API requests
  - Loading states for better UX
  - Image download functionality for Pokémon artwork
  - Responsive grid layout for multiple cards

**Communication**: RESTful API calls to backend
- Uses the Fetch API for asynchronous HTTP requests
- Implements parallel fetching with `Promise.all()` for multiple Pokémon queries
- Error handling for network failures and 404 responses

**Styling**: Dark-themed UI with Pokémon background
- Background: Semi-transparent overlay (85%) over Pokémon collage artwork
- Boxes: 50% opacity for transparency and background visibility
- Color scheme: Dark blues, cyans, and grays with accent colors
- Responsive design adapts to mobile and desktop screens

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

## File Structure

```
.
├── backend/
│   ├── src/main/java/com/example/pokedex/
│   │   ├── PokedexApplication.java
│   │   ├── controller/PokemonController.java
│   │   ├── service/PokemonService.java
│   │   └── client/PokeApiClient.java
│   ├── src/main/resources/application.yml
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── pokemon-background.jpg
├── server.py
├── README.md
└── replit.md
```

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
- **Components used**:
  - Spring Web (REST endpoints)
  - Spring Boot Actuator (health checks)
  - Configuration properties management
  - RestClient for HTTP requests

### Runtime Dependencies

**Java Runtime Environment**
- Required version: Java 11+
- Executes the compiled JAR file

**Python 3**
- Used for the development proxy server
- Standard library modules: `http.server`, `socketserver`, `urllib`

### No Database

This application does not use a persistent database. All data is:
- Fetched from PokéAPI on-demand
- Cached in-memory temporarily
- Lost on application restart (by design, as Pokémon data changes infrequently)

## Features Implemented

1. **Search Functionality**
   - Single Pokémon search by name or ID
   - Multi-Pokémon search with comma-separated input
   - Parallel API requests for fast multi-searches
   - Error handling for not-found Pokémon

2. **Display**
   - Official artwork display for each Pokémon
   - Type badges showing Pokémon types
   - Height and weight information
   - Base experience stats
   - Abilities list (with hidden ability indicator)
   - Detailed stat breakdown with visual bars
   - Special tags (pseudo-legendary, dragon type, hidden ability indicators)

3. **User Experience**
   - Loading state feedback
   - Error messages for failed searches
   - Responsive grid layout for multiple cards
   - Keyboard support (Enter key to search)
   - Image download functionality

4. **Performance**
   - In-memory LRU caching with TTL
   - Parallel requests for multi-Pokémon searches
   - Configurable cache parameters

## Key Design Decisions

- **No Framework Dependencies**: Frontend uses vanilla JavaScript for simplicity and zero build overhead
- **In-Memory Cache**: Trades memory usage for reduced API calls and better performance
- **LRU + TTL**: Combines both strategies to manage cache effectively
- **Python Proxy**: Simplifies development by handling CORS without requiring backend modifications
- **Dark Theme**: Modern, eye-friendly interface with semi-transparent elements
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
