package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;

public interface ProductAdminService {

    // UC-PM-01 Manage Products
    void addProduct(Product product);

    void updateProduct(Product product);

    void deleteProduct(Long productId);

    // UC-PM-02 Manage Categories
    void addCategory(Category category);

    void updateCategory(Category category);

    void deleteCategory(Long categoryId);

    // UC-PM-03 Manage Product Images
    void addProductImage(Long productId, String imageUrl);

    void removeProductImage(Long imageId);

    // UC-PM-04 Set Product Attributes
    // Covered by updateProduct, but logic might be separate.
}
