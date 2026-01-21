package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final com.ecommerce.backend.repository.CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
            com.ecommerce.backend.repository.CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setDescription(productDetails.getDescription());
        if (productDetails.getCategories() != null) {
            product.setCategories(productDetails.getCategories());
        }
        return productRepository.save(product);
    }

    public Product addCategoryToProduct(Long productId, Long categoryId) {
        Product product = getProductById(productId);
        com.ecommerce.backend.entity.Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + categoryId));

        if (!product.getCategories().contains(category)) {
            product.getCategories().add(category);
            return productRepository.save(product);
        }
        return product;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
