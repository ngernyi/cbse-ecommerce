package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlists")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/customer/{customerId}")
    public Wishlist createWishlist(@PathVariable String customerId, @RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        return wishlistService.createWishlist(Long.parseLong(customerId), name);
    }

    @GetMapping("/customer/{customerId}")
    public List<Wishlist> getWishlistsByCustomer(@PathVariable String customerId) {
        return wishlistService.getWishlistsByCustomerId(Long.parseLong(customerId));
    }

    @GetMapping("/{id}")
    public Wishlist getWishlistById(@PathVariable String id) {
        return wishlistService.getWishlistById(Long.parseLong(id));
    }

    @PostMapping("/{wishlistId}/product/{productId}")
    public Wishlist addProductToWishlist(@PathVariable String wishlistId, @PathVariable String productId) {
        return wishlistService.addProductToWishlist(Long.parseLong(wishlistId), Long.parseLong(productId));
    }

    @DeleteMapping("/{wishlistId}/product/{productId}")
    public Wishlist removeProductFromWishlist(@PathVariable String wishlistId, @PathVariable String productId) {
        return wishlistService.removeProductFromWishlist(Long.parseLong(wishlistId), Long.parseLong(productId));
    }

    @DeleteMapping("/{id}")
    public void deleteWishlist(@PathVariable String id) {
        wishlistService.deleteWishlist(Long.parseLong(id));
    }
}
