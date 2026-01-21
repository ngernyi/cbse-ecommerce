package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.CartItem;

import java.util.List;

public interface CartService {

    // UC-SC-01 Add to Cart
    void addToCart(Long customerId, Long productId, int quantity);

    // UC-SC-02 Persist Cart Sessions (Methods to retrieve/update)
    List<CartItem> getCart(Long customerId);

    void updateCartItemQuantity(Long cartItemId, int quantity);

    void removeCartItem(Long cartItemId);

    void clearCart(Long customerId);

    // UC-SC-03 Apply Coupons
    // Returns discount amount or updated total
    double applyCoupon(Long customerId, String couponCode);

    // UC-SC-04 View Calculated Cart Pricing
    double getCartTotal(Long customerId);
}
