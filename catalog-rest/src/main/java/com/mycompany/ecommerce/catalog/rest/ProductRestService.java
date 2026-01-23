package com.mycompany.ecommerce.catalog.rest;

import com.mycompany.ecommerce.api.ProductService;
import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductRestService {

    private ProductService productService;

    public void setProductService(ProductService productService) {
        this.productService = productService;
    }

    // ==================== Products & Search ====================

    @GET
    @Path("products")
    public List<Product> getProducts(@QueryParam("search") String search) {
        if (search != null && !search.isEmpty()) {
            return productService.searchProducts(search);
        }
        return productService.getAllProducts();
    }

    @GET
    @Path("products/{id}")
    public Product getProduct(@PathParam("id") Long id) {
        return productService.getProduct(id);
    }

    @GET
    @Path("products/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathParam("categoryId") Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    // ==================== Categories ====================

    @GET
    @Path("categories")
    public List<Category> getAllCategories() {
        return productService.getAllCategories();
    }

    // ==================== Recommendations ====================

    @GET
    @Path("recommendations")
    public List<Product> getRecommendations() {
        return productService.getRecommendations(null);
    }

    @GET
    @Path("recommendations/{customerId}")
    public List<Product> getRecommendationsForCustomer(@PathParam("customerId") Long customerId) {
        return productService.getRecommendations(customerId);
    }
}
