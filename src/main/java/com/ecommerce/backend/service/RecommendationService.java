package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public RecommendationService(ProductRepository productRepository, CartItemRepository cartItemRepository,
            OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<Product> getRecommendations(Long customerId) {
        // 1. Collect Category IDs from CartItems
        List<CartItem> cartItems = cartItemRepository.findByCustomerId(customerId);
        Set<Long> categoryIds = new HashSet<>();

        for (CartItem item : cartItems) {
            for (Category category : item.getProduct().getCategories()) {
                categoryIds.add(category.getId());
            }
        }

        // 2. Collect Category IDs from OrderItems
        List<OrderItem> orderItems = orderItemRepository.findByCustomerId(customerId);
        for (OrderItem item : orderItems) {
            for (Category category : item.getProduct().getCategories()) {
                categoryIds.add(category.getId());
            }
        }

        // 3. If no history, return generic recommendations (e.g., all products or top
        // 10)
        if (categoryIds.isEmpty()) {
            // For simplicity, returning all products or a subset.
            // In a real app, you might return "Popular" or "New Arrivals".
            return productRepository.findAll();
        }

        // 4. Find products in these categories
        List<Product> recommendations = productRepository
                .findDistinctByCategoriesIdIn(new java.util.ArrayList<>(categoryIds));

        // 5. (Optional) Filter out products the user already bought or has in cart?
        // The requirement didn't strictly say to exclude them, but usually
        // recommendations exclude what you already have.
        // For this simple implementation, we will keep them or just return the list as
        // is.

        return recommendations;
    }
}
