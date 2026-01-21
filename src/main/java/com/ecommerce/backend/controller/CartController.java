package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/customer/{customerId}")
    public List<CartItem> getCartItems(@PathVariable String customerId) {
        return cartService.getCartItems(Long.parseLong(customerId));
    }

    @PostMapping("/customer/{customerId}/calculate")
    public Double calculateTotal(@PathVariable String customerId, @RequestBody List<Long> cartItemIds) {
        return cartService.calculateTotal(Long.parseLong(customerId), cartItemIds);
    }

    @PostMapping("/customer/{customerId}/add")
    public CartItem addToCart(@PathVariable String customerId, @RequestBody Map<String, Object> payload) {
        Long productId = Long.parseLong(payload.get("productId").toString());
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());
        return cartService.addToCart(Long.parseLong(customerId), productId, quantity);
    }

    @PutMapping("/item/{cartItemId}")
    public CartItem updateQuantity(@PathVariable String cartItemId, @RequestBody Map<String, Object> payload) {
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());
        return cartService.updateQuantity(Long.parseLong(cartItemId), quantity);
    }

    @DeleteMapping("/item/{cartItemId}")
    public void removeFromCart(@PathVariable String cartItemId) {
        cartService.removeFromCart(Long.parseLong(cartItemId));
    }

    @DeleteMapping("/customer/{customerId}")
    public void clearCart(@PathVariable String customerId) {
        cartService.clearCart(Long.parseLong(customerId));
    }
}
