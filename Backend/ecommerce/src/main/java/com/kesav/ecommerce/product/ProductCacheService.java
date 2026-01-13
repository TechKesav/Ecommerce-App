package com.kesav.ecommerce.product;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

/**
 * Redis Cache Service for Product caching
 * 
 * Cache Strategy:
 * - GET /api/products → TTL 5 minutes (cache all products)
 * - GET /api/products/{id} → TTL 5 minutes (cache individual product)
 * 
 * Cache Invalidation (CRITICAL):
 * - When admin adds product → Evict products::all cache
 * - When admin updates product → Evict product::id AND products::all cache
 * - When admin deletes product → Evict product::id AND products::all cache
 */
@Service
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true")
public class ProductCacheService {

    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;

    private static final String PRODUCTS_CACHE_KEY = "products::all";
    private static final String PRODUCT_CACHE_KEY_PREFIX = "product::";
    private static final long CACHE_TTL_MINUTES = 5;

    public ProductCacheService() {
        System.out.println("🔧 ProductCacheService initialized");
    }

    @PostConstruct
    public void afterInit() {
        if (redisTemplate != null) {
            try {
                redisTemplate.getConnectionFactory().getConnection().ping();
                System.out.println("✅ Redis CONNECTED successfully! Ready to cache");
            } catch (Exception e) {
                System.err.println("❌ Redis connection FAILED: " + e.getMessage());
                System.err.println("   Redis caching is DISABLED - app will work without cache");
            }
        } else {
            System.out.println("⚠️ RedisTemplate is NULL - Redis config not activated (redis.enabled might be false)");
        }
    }

    /**
     * Get cached products list
     * @return Cached products list or null if not found
     */
    public Object getProductsCache() {
        if (redisTemplate == null) {
            System.out.println("⚠️ Redis is NOT configured (redisTemplate is null)");
            return null;
        }
        try {
            Object result = redisTemplate.opsForValue().get(PRODUCTS_CACHE_KEY);
            if (result != null) {
                System.out.println("✓ Cache HIT: products::all");
            } else {
                System.out.println("✗ Cache MISS: products::all (will rebuild from DB)");
            }
            return result;
        } catch (Exception e) {
            System.err.println("❌ Redis error (getProductsCache): " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Cache all products
     * @param products List of all products
     */
    public void setProductsCache(Object products) {
        if (redisTemplate == null) {
            System.out.println("⚠️ Redis is NOT configured (redisTemplate is null) - cannot cache");
            return;
        }
        try {
            redisTemplate.opsForValue().set(
                PRODUCTS_CACHE_KEY, 
                products, 
                CACHE_TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            System.out.println("✅ Cached products::all (TTL: 5 minutes)");
        } catch (Exception e) {
            System.err.println("❌ Redis error (setProductsCache): " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Get cached product by ID
     * @param id Product ID
     * @return Cached product or null if not found
     */
    public Object getProductCache(Long id) {
        if (redisTemplate == null) return null;
        try {
            return redisTemplate.opsForValue().get(PRODUCT_CACHE_KEY_PREFIX + id);
        } catch (Exception e) {
            System.err.println("Redis error (getProductCache): " + e.getMessage());
            return null;
        }
    }

    /**
     * Cache individual product
     * @param id Product ID
     * @param product Product object
     */
    public void setProductCache(Long id, Object product) {
        if (redisTemplate == null) return;
        try {
            redisTemplate.opsForValue().set(
                PRODUCT_CACHE_KEY_PREFIX + id, 
                product, 
                CACHE_TTL_MINUTES, 
                TimeUnit.MINUTES
            );
            System.out.println("✓ Cached product::" + id + " (TTL: 5 minutes)");
        } catch (Exception e) {
            System.err.println("Redis error (setProductCache): " + e.getMessage());
        }
    }

    /**
     * IMPORTANT: Evict product cache when product is added
     * This ensures the products list is refreshed
     */
    public void evictProductsCache() {
        if (redisTemplate == null) return;
        try {
            Boolean deleted = redisTemplate.delete(PRODUCTS_CACHE_KEY);
            System.out.println("✗ Evicted cache: products::all (deleted: " + deleted + ")");
        } catch (Exception e) {
            System.err.println("Redis error (evictProductsCache): " + e.getMessage());
        }
    }

    /**
     * IMPORTANT: Evict product cache when product is updated or deleted
     * This ensures the specific product and list are refreshed
     */
    public void evictProductCache(Long id) {
        if (redisTemplate == null) return;
        try {
            Boolean productDeleted = redisTemplate.delete(PRODUCT_CACHE_KEY_PREFIX + id);
            Boolean listDeleted = redisTemplate.delete(PRODUCTS_CACHE_KEY);
            System.out.println("✗ Evicted cache: product::" + id + " (deleted: " + productDeleted + ")");
            System.out.println("✗ Evicted cache: products::all (deleted: " + listDeleted + ")");
        } catch (Exception e) {
            System.err.println("Redis error (evictProductCache): " + e.getMessage());
        }
    }

    /**
     * Clear all product caches (emergency cleanup)
     */
    public void clearAllProductCaches() {
        if (redisTemplate == null) return;
        try {
            redisTemplate.getConnectionFactory().getConnection().flushDb();
            System.out.println("✗ Cleared all Redis caches");
        } catch (Exception e) {
            System.err.println("Redis error (clearAllProductCaches): " + e.getMessage());
        }
    }

    /**
     * Check if Redis is enabled
     */
    public boolean isRedisEnabled() {
        return redisTemplate != null;
    }
}
