package com.kesav.ecommerce.product;

import com.kesav.ecommerce.product.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product createProduct(Product product, MultipartFile imageFile) throws IOException;
    Optional<Product> getProductById(Long id);
    List<Product> getAllProducts();
    Product updateProduct(Long id, Product updatedProduct, MultipartFile imageFile) throws IOException;
    void deleteProduct(Long id);
    byte[] getProductImage(Long id);
}
