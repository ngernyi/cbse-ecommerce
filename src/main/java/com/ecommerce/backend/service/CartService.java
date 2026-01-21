package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.CustomerRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, CustomerRepository customerRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getCartItems(Long customerId) {
        return cartItemRepository.findByCustomerId(customerId);
    }

    public CartItem addToCart(Long customerId, Long productId, Integer quantity) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Optional<CartItem> existingItem = cartItemRepository.findByCustomerIdAndProductId(customerId, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCustomer(customer);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            newItem.setAddedAt(LocalDateTime.now());
            return cartItemRepository.save(newItem);
        }
    }

    public CartItem updateQuantity(Long cartItemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));

        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        } else {
            item.setQuantity(quantity);
            return cartItemRepository.save(item);
        }
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long customerId) {
        cartItemRepository.deleteByCustomerId(customerId);
    }

    public Double calculateTotal(Long customerId, List<Long> cartItemIds) {
        List<CartItem> items = cartItemRepository.findAllById(cartItemIds);
        double total = 0.0;
        for (CartItem item : items) {
            if (item.getCustomer().getId().equals(customerId)) {
                total += item.getProduct().getPrice() * item.getQuantity();
            }
        }
        return total;
    }
}