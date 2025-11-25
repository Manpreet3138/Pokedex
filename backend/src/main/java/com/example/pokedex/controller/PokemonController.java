package com.example.pokedex.controller;

import com.example.pokedex.service.PokemonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    private final PokemonService pokemonService;

    public PokemonController(PokemonService pokemonService) {
        this.pokemonService = pokemonService;
    }

    @GetMapping("/{nameOrId}")
    public ResponseEntity<String> getPokemon(@PathVariable String nameOrId) {
        String pokemonJson = pokemonService.getPokemon(nameOrId);
        if (pokemonJson == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("{\"error\":\"Pokemon not found\"}");
        }
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(pokemonJson);
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchPokemon(@RequestParam String keyword) {
        List<String> results = pokemonService.searchPokemon(keyword);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\":\"UP\"}");
    }
}
