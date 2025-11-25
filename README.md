# Java Pokédex

A modern, full-stack Pokédex application that lets you search for and explore Pokémon data. Built with Java Spring Boot backend and vanilla JavaScript frontend, featuring multi-search capabilities, image downloads, and a beautiful dark-themed UI with Pokémon background artwork.

## Features

✨ **Multi-Pokémon Search** - Search for multiple Pokémon at once using comma-separated names or IDs
- Example: `pikachu, charizard, 25` shows all three Pokémon side by side

📥 **Download Pokémon Images** - Download official artwork of any Pokémon directly to your device with a single click

🎨 **Beautiful UI** - Dark-themed interface with Pokémon background artwork, responsive grid layout that works on all screen sizes

⚡ **Smart Caching** - Backend caches Pokémon data to reduce API calls and improve performance

🔍 **Detailed Info** - See comprehensive Pokémon stats including:
- Types, abilities, and base stats
- Height, weight, and base experience
- Stat bars showing comparative strength
- Special tags (pseudo-legendary, dragon type, hidden abilities, etc.)

## Getting Started

### Prerequisites

- Java 11+ (for backend)
- Python 3 (for frontend proxy server)
- Maven (for building backend)

### Running the Application

1. **Start the Backend (Java Spring Boot):**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend runs on: `http://localhost:8080`

2. **Start the Frontend (Python Proxy Server):**
   ```bash
   python3 server.py
   ```
   Frontend runs on: `http://localhost:5000`

3. **Open your browser:**
   - Visit `http://localhost:5000` to access the Pokédex

## How to Use

1. **Search for Pokémon:**
   - Enter one or more Pokémon names or IDs in the search box
   - Separate multiple entries with commas: `pikachu, bulbasaur, 6`
   - Press Enter or click the Search button

2. **View Results:**
   - Each Pokémon appears in its own card
   - See the official artwork, types, abilities, and detailed stats
   - Cards display in a responsive grid layout

3. **Download Images:**
   - Click the "Download Image" button below any Pokémon sprite
   - The image saves to your device as `{pokemon-name}.png`

## Project Structure

```
.
├── backend/                          # Java Spring Boot backend
│   ├── src/main/java/com/example/pokedex/
│   │   ├── PokedexApplication.java   # Spring Boot main class
│   │   ├── controller/               # REST endpoints
│   │   ├── service/                  # Business logic
│   │   └── client/                   # PokéAPI integration
│   ├── application.yml               # Configuration
│   └── pom.xml                       # Maven dependencies
├── frontend/                         # Frontend files
│   ├── index.html                    # Main HTML
│   ├── app.js                        # JavaScript logic
│   ├── styles.css                    # Styling
│   └── pokemon-background.jpg        # Background image
├── server.py                         # Development proxy server
└── README.md                         # This file
```

## API Endpoints

### Backend

- `GET /api/pokemon/{nameOrId}` - Fetch Pokémon data by name or ID
  - Example: `GET http://localhost:8080/api/pokemon/pikachu`
  - Example: `GET http://localhost:8080/api/pokemon/25`

- `GET /api/pokemon/health` - Health check endpoint

### Response Example

```json
{
  "id": 25,
  "name": "pikachu",
  "types": [
    { "type": { "name": "electric" } }
  ],
  "sprites": {
    "other": {
      "official-artwork": {
        "front_default": "https://..."
      }
    }
  },
  "stats": [...],
  "abilities": [...],
  "height": 4,
  "weight": 60,
  "base_experience": 112
}
```

## Configuration

### Backend Caching

Edit `backend/src/main/resources/application.yml` to customize cache behavior:

```yaml
cache:
  maxEntries: 200        # Maximum number of cached Pokémon
  ttlMillis: 600000     # Cache expiration time (10 minutes)
```

## Technology Stack

**Backend:**
- Java with Spring Boot
- Maven for build management
- In-memory LRU cache with TTL expiration
- RESTful API architecture

**Frontend:**
- Vanilla JavaScript (no framework dependencies)
- HTML5 & CSS3
- Fetch API for async requests
- Responsive grid layout

**Development:**
- Python 3 proxy server for development CORS handling
- Runs on port 5000 (frontend) and 8080 (backend)

## Data Source

All Pokémon data comes from the [PokéAPI](https://pokeapi.co/), a free, community-maintained Pokémon API.

## Notes

- Pokémon data is cached in-memory to reduce API calls to PokéAPI
- Cache uses LRU (Least Recently Used) eviction strategy
- Cache entries expire after the configured TTL
- No persistent database is used - data is fetched on-demand and cached temporarily
- Background image is served from the frontend directory

## Building for Production

To build the backend JAR for deployment:

```bash
cd backend
mvn clean package
# JAR file created at: target/pokedex-backend-0.0.1-SNAPSHOT.jar
java -jar target/pokedex-backend-0.0.1-SNAPSHOT.jar
```

## License

This project uses data from PokéAPI which is available under the Fair Use doctrine. Please refer to the PokéAPI documentation for their terms of use.
