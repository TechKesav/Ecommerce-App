package com.kesav.ecommerce.product.impl;

import com.kesav.ecommerce.product.Product;
import com.kesav.ecommerce.product.ProductRepository;
import com.kesav.ecommerce.product.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            product.setImageData(imageFile.getBytes());
            product.setImageType(imageFile.getContentType());
            product.setImageName(imageFile.getOriginalFilename());
        }
        return productRepository.save(product);
    }

    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct, MultipartFile imageFile) throws IOException {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setDescription(updatedProduct.getDescription());
            product.setPrice(updatedProduct.getPrice());
            product.setStock(updatedProduct.getStock());
            try {
                if (imageFile != null && !imageFile.isEmpty()) {
                    product.setImageData(imageFile.getBytes());
                    product.setImageType(imageFile.getContentType());
                    product.setImageName(imageFile.getOriginalFilename()); // update image name
                }
            } catch (IOException e) {
                throw new RuntimeException("Image update failed", e);
            }
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }


    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public byte[] getProductImage(Long id) {
        return productRepository.findById(id)
                .map(Product::getImageData)
                .orElseThrow(() -> new RuntimeException("Image not found"));
    }
}
