package com.example.pokedex.service;

import com.example.pokedex.cache.LruCache;
import com.example.pokedex.client.PokeApiClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PokemonService {

    private final PokeApiClient pokeApiClient;
    private final LruCache<String, String> cache;

    public PokemonService(
            PokeApiClient pokeApiClient,
            @Value("${pokedex.cache.maxEntries}") int maxEntries,
            @Value("${pokedex.cache.ttlMillis}") long ttlMillis) {
        this.pokeApiClient = pokeApiClient;
        this.cache = new LruCache<>(maxEntries, ttlMillis);
    }

    public String getPokemon(String nameOrId) {
        String key = nameOrId.toLowerCase();

        // 1. Try cache
        String cached = cache.get(key);
        if (cached != null) {
            return cached;
        }

        // 2. Call vendor API
        String rawJson = pokeApiClient.getPokemonRaw(key);
        if (rawJson == null) {
            return null;
        }

        // 3. Store in cache and return
        cache.put(key, rawJson);
        return rawJson;
    }
}
