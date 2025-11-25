package com.example.pokedex.cache;

import java.util.LinkedHashMap;
import java.util.Map;

public class LruCache<K, V> {

    private final int maxEntries;
    private final long ttlMillis;

    private final LinkedHashMap<K, CacheEntry<V>> store;

    public LruCache(int maxEntries, long ttlMillis) {
        this.maxEntries = maxEntries;
        this.ttlMillis = ttlMillis;

        this.store = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, CacheEntry<V>> eldest) {
                return size() > LruCache.this.maxEntries;
            }
        };
    }

    public synchronized V get(K key) {
        CacheEntry<V> entry = store.get(key);
        if (entry == null) {
            return null;
        }
        if (isExpired(entry)) {
            store.remove(key);
            return null;
        }
        return entry.getValue();
    }

    public synchronized void put(K key, V value) {
        store.put(key, new CacheEntry<>(value));
    }

    private boolean isExpired(CacheEntry<V> entry) {
        long age = System.currentTimeMillis() - entry.getCreatedAt();
        return age > ttlMillis;
    }

    public synchronized int size() {
        return store.size();
    }
}
