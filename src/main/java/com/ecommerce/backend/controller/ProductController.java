package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductImage;
import com.ecommerce.backend.service.ProductImageService;
import com.ecommerce.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    public ProductController(ProductService productService, ProductImageService productImageService) {
        this.productService = productService;
        this.productImageService = productImageService;
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(Long.parseLong(id));
    }

    @PutMapping("/{id}")
    public Product updateProduct(@PathVariable String id, @RequestBody Product product) {
        return productService.updateProduct(Long.parseLong(id), product);
    }

    @PostMapping("/{productId}/category/{categoryId}")
    public Product addCategoryToProduct(@PathVariable String productId, @PathVariable String categoryId) {
        return productService.addCategoryToProduct(Long.parseLong(productId), Long.parseLong(categoryId));
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        return productService.searchProducts(keyword, sortBy, direction);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable String categoryId,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String direction) {
        return productService.getProductsByCategoryId(Long.parseLong(categoryId), sortBy, direction);
    }

    @PostMapping("/{id}/images")
    public ProductImage uploadImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        return productImageService.uploadImage(Long.parseLong(id), file);
    }

    @GetMapping("/{id}/images")
    public List<ProductImage> getProductImages(@PathVariable String id) {
        return productImageService.getImagesByProductId(Long.parseLong(id));
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(Long.parseLong(id));
    }
}
