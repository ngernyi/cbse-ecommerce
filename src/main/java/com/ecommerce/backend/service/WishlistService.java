package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Wishlist;
import com.ecommerce.backend.repository.CustomerRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public WishlistService(WishlistRepository wishlistRepository, CustomerRepository customerRepository,
            ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public Wishlist createWishlist(Long customerId, String name) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));

        Wishlist wishlist = new Wishlist();
        wishlist.setName(name);
        wishlist.setCustomer(customer);

        return wishlistRepository.save(wishlist);
    }

    public List<Wishlist> getWishlistsByCustomerId(Long customerId) {
        return wishlistRepository.findByCustomerId(customerId);
    }

    public Wishlist getWishlistById(Long id) {
        return wishlistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Wishlist not found with id: " + id));
    }

    public Wishlist addProductToWishlist(Long wishlistId, Long productId) {
        Wishlist wishlist = getWishlistById(wishlistId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
            return wishlistRepository.save(wishlist);
        }
        return wishlist;
    }

    public Wishlist removeProductFromWishlist(Long wishlistId, Long productId) {
        Wishlist wishlist = getWishlistById(wishlistId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        wishlist.getProducts().remove(product);
        return wishlistRepository.save(wishlist);
    }

    public void deleteWishlist(Long id) {
        wishlistRepository.deleteById(id);
    }
}
