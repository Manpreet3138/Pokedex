package com.example.pokedex.service;

import com.example.pokedex.cache.LruCache;
import com.example.pokedex.client.PokeApiClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PokemonService {

    private final PokeApiClient pokeApiClient;
    private final LruCache<String, String> cache;
    private List<String> pokemonNames = null;
    private final Object pokemonNamesLock = new Object();

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

    public List<String> searchPokemon(String keyword) {
        String lowerKeyword = keyword.toLowerCase().trim();
        if (lowerKeyword.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> allNames = getPokemonNames();
        return allNames.stream()
                .filter(name -> name.contains(lowerKeyword))
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<String> getPokemonNames() {
        if (pokemonNames != null) {
            return pokemonNames;
        }

        synchronized (pokemonNamesLock) {
            if (pokemonNames != null) {
                return pokemonNames;
            }

            pokemonNames = fetchPokemonNames();
            return pokemonNames;
        }
    }

    private List<String> fetchPokemonNames() {
        try {
            List<String> names = new ArrayList<>();
            int limit = 1000;
            int offset = 0;

            while (offset < 2000) {
                String url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;
                String response = pokeApiClient.getPokemonRaw(url);
                if (response == null) break;

                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response);
                JsonNode results = root.get("results");

                if (results != null && results.isArray()) {
                    results.forEach(item -> {
                        String name = item.get("name").asText();
                        names.add(name);
                    });
                }

                JsonNode next = root.get("next");
                if (next == null || next.isNull()) break;

                offset += limit;
            }

            return names;
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
