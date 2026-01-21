package com.mycompany.ecommerce.cart.rest;

import com.mycompany.ecommerce.api.CartService;
import com.mycompany.ecommerce.api.model.CartItem;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/cart")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CartRestService {

    private CartService cartService;

    public void setCartService(CartService cartService) {
        this.cartService = cartService;
    }

    // ==================== View Cart ====================

    @GET
    @Path("/{customerId}")
    public List<CartItem> getCart(@PathParam("customerId") Long customerId) {
        return cartService.getCart(customerId);
    }

    // ==================== Add to Cart ====================

    @POST
    @Path("/{customerId}/add")
    public void addToCart(@PathParam("customerId") Long customerId, AddCartItemRequest request) {
        cartService.addToCart(customerId, request.getProductId(), request.getQuantity());
    }

    // Helper POJO for request body
    public static class AddCartItemRequest {
        private Long productId;
        private int quantity;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    // ==================== Manage Items ====================

    @PUT
    @Path("/items/{itemId}")
    public void updateCartItem(@PathParam("itemId") Long itemId, @QueryParam("quantity") int quantity) {
        cartService.updateCartItemQuantity(itemId, quantity);
    }

    @DELETE
    @Path("/items/{itemId}")
    public void removeCartItem(@PathParam("itemId") Long itemId) {
        cartService.removeCartItem(itemId);
    }

    // ==================== Pricing & Coupons ====================

    @GET
    @Path("/{customerId}/total")
    public double getCartTotal(@PathParam("customerId") Long customerId) {
        return cartService.getCartTotal(customerId);
    }

    @POST
    @Path("/{customerId}/coupon")
    public double applyCoupon(@PathParam("customerId") Long customerId, @QueryParam("code") String code) {
        return cartService.applyCoupon(customerId, code);
    }
}
