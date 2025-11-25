package com.example.pokedex.cache;

public class CacheEntry<V> {
    private final V value;
    private final long createdAt;

    public CacheEntry(V value) {
        this.value = value;
        this.createdAt = System.currentTimeMillis();
    }

    public V getValue() {
        return value;
    }

    public long getCreatedAt() {
        return createdAt;
    }
}
