package com.mycompany.ecommerce.product.admin.rest;

import com.mycompany.ecommerce.api.ProductAdminService;
import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductAdminRestService {

    private ProductAdminService productAdminService;

    public void setProductAdminService(ProductAdminService productAdminService) {
        this.productAdminService = productAdminService;
    }

    // ==================== Products ====================

    @POST
    @Path("/products")
    public void addProduct(Product product) {
        productAdminService.addProduct(product);
    }

    @PUT
    @Path("/products/{id}")
    public void updateProduct(@PathParam("id") Long id, Product product) {
        product.setId(id);
        productAdminService.updateProduct(product);
    }

    @DELETE
    @Path("/products/{id}")
    public void deleteProduct(@PathParam("id") Long id) {
        productAdminService.deleteProduct(id);
    }

    // ==================== Categories ====================

    @POST
    @Path("/categories")
    public void addCategory(Category category) {
        productAdminService.addCategory(category);
    }

    @PUT
    @Path("/categories/{id}")
    public void updateCategory(@PathParam("id") Long id, Category category) {
        category.setId(id);
        productAdminService.updateCategory(category);
    }

    @DELETE
    @Path("/categories/{id}")
    public void deleteCategory(@PathParam("id") Long id) {
        productAdminService.deleteCategory(id);
    }

    // ==================== Images ====================

    @POST
    @Path("/products/{id}/images")
    public void addProductImage(@PathParam("id") Long productId, @QueryParam("url") String imageUrl) {
        productAdminService.addProductImage(productId, imageUrl);
    }

    @DELETE
    @Path("/images/{id}")
    public void removeProductImage(@PathParam("id") Long imageId) {
        productAdminService.removeProductImage(imageId);
    }
}
