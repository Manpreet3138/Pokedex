package com.example.pokedex.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;

@Component
public class PokeApiClient {

    private final RestClient restClient;
    private final String baseUrl;

    public PokeApiClient(RestClient restClient,
                         @Value("${pokedex.pokeapi.baseUrl}") String baseUrl) {
        this.restClient = restClient;
        this.baseUrl = baseUrl;
    }

    public String getPokemonRaw(String nameOrId) {
        String url = baseUrl + "/pokemon/" + nameOrId.toLowerCase();

        try {
            return restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(String.class);
        } catch (HttpClientErrorException.NotFound e) {
            // return null – service layer will convert to 404
            return null;
        }
    }
}
