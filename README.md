# Java Pokédex

## Backend (Java + Spring Boot)

```bash
cd backend
mvn clean package
java -jar target/pokedex-backend-0.0.1-SNAPSHOT.jar
```

Backend runs on: `http://localhost:8080`

Test:

- `GET http://localhost:8080/api/pokemon/pikachu`
- `GET http://localhost:8080/api/pokemon/health`

## Frontend

Open `frontend/index.html` in your browser.

Make sure backend is running at `http://localhost:8080`.
Then search for any Pokémon name or ID (e.g. `pikachu`, `charizard`, `150`).

## Notes

- Responses from PokéAPI are cached in-memory with:
  - LRU eviction (`maxEntries` in `application.yml`)
  - TTL expiration (`ttlMillis` in `application.yml`)
- You can tweak these to handle performance/footprint tradeoffs.
