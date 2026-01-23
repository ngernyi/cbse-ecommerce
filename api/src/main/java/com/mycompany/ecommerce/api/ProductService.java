package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;

import java.util.List;

public interface ProductService {

    // UC-CS-01 Search Products
    List<Product> searchProducts(String keyword);

    List<Product> getAllProducts();

    // UC-CS-02 Browse Categories
    List<Category> getAllCategories();

    List<Product> getProductsByCategory(Long categoryId);

    // UC-CS-03 View Recommendations
    List<Product> getRecommendations(Long customerId);

    // UC-CS-04 Sort Results
    // Sorting can be a parameter in search or a separate helper,
    // but usually handled by passing a sort param to search/category methods.
    // We will overload search/category methods or just assume list processing in
    // implementation/controller if data set is small.
    // For now, let's keep it simple.

    Product getProduct(Long id);
}
