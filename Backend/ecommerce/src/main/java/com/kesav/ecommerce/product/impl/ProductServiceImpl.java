package com.kesav.ecommerce.product.impl;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.kesav.ecommerce.product.Product;
import com.kesav.ecommerce.product.ProductCacheService;
import com.kesav.ecommerce.product.ProductRepository;
import com.kesav.ecommerce.product.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired(required = false)
    private ProductCacheService cacheService;

    @Override
    public Product createProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageData(imageFile.getBytes());
            product.setImageType(imageFile.getContentType());
            product.setImageName(imageFile.getOriginalFilename());
        }
        Product savedProduct = productRepository.save(product);
        
        // ✓ CACHE INVALIDATION: Clear products list cache when new product is added
        if (cacheService != null) {
            cacheService.evictProductsCache();
        }
        
        return savedProduct;
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        // Try to get from cache first
        if (cacheService != null) {
            Object cached = cacheService.getProductCache(id);
            if (cached instanceof Product) {
                System.out.println("✓ Cache HIT: product::" + id);
                return Optional.of((Product) cached);
            }
        }
        
        // If not in cache, get from database and cache it
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent() && cacheService != null) {
            cacheService.setProductCache(id, product.get());
        }
        return product;
    }

    @Override
    public List<Product> getAllProducts() {
        // Try to get from cache first
        if (cacheService != null) {
            Object cached = cacheService.getProductsCache();
            if (cached instanceof List) {
                System.out.println("✓ Cache HIT: products::all");
                return (List<Product>) cached;
            }
        }
        
        // If not in cache, get from database and cache it
        List<Product> products = productRepository.findAll();
        if (cacheService != null) {
            cacheService.setProductsCache(products);
        }
        return products;
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct, MultipartFile imageFile) throws IOException {
        Product updated = productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            try {
                if (imageFile != null && !imageFile.isEmpty()) {
                    product.setImageData(imageFile.getBytes());
                    product.setImageType(imageFile.getContentType());
                    product.setImageName(imageFile.getOriginalFilename());
                }
            } catch (IOException e) {
                throw new RuntimeException("Image update failed", e);
            }
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
        
        // ✓ CACHE INVALIDATION: Evict product and products list cache when product is updated
        if (cacheService != null) {
            cacheService.evictProductCache(id);
        }
        
        return updated;
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
        
        // ✓ CACHE INVALIDATION: Evict product and products list cache when product is deleted
        if (cacheService != null) {
            cacheService.evictProductCache(id);
        }
    }

    @Override
    public byte[] getProductImage(Long id) {
        return productRepository.findById(id)
                .map(Product::getImageData)
                .orElseThrow(() -> new RuntimeException("Image not found"));
    }
}

