package com.mycompany.ecommerce.catalog.rest;

import com.mycompany.ecommerce.api.ProductService;
import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/products")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRestService {

    private ProductService productService;

    public void setProductService(ProductService productService) {
        this.productService = productService;
    }

    // ==================== Search Products ====================

    @GET
    public List<Product> searchProducts(@QueryParam("search") String search) {
        if (search != null && !search.isEmpty()) {
            return productService.searchProducts(search);
        }
        // If no search query, return recommendations or all products (not defined in UC, defaulting to recommendations)
        return productService.getRecommendations();
    }

    // ==================== Browse Categories ====================

    @GET
    @Path("/categories")
    public List<Category> getAllCategories() {
        return productService.getAllCategories();
    }

    @GET
    @Path("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathParam("categoryId") Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    // ==================== View Recommendations ====================

    @GET
    @Path("/recommendations")
    public List<Product> getRecommendations() {
        return productService.getRecommendations();
    }

    // ==================== Product Details ====================

    @GET
    @Path("/{id}")
    public Product getProduct(@PathParam("id") Long id) {
        return productService.getProduct(id);
    }
}
