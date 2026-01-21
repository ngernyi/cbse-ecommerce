package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.repository.CustomerRepository;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, CustomerRepository customerRepository,
            ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    public OrderItem createOrderItem(Long customerId, Long productId, Integer quantity) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        OrderItem orderItem = new OrderItem();
        orderItem.setCustomer(customer);
        orderItem.setProduct(product);
        orderItem.setQuantity(quantity);
        orderItem.setStatus(OrderStatus.PENDING);
        orderItem.setOrderDate(LocalDateTime.now());

        return orderItemRepository.save(orderItem);
    }

    public List<OrderItem> getOrderItemsByCustomerId(Long customerId) {
        return orderItemRepository.findByCustomerId(customerId);
    }

    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found with id: " + id));
    }

    public OrderItem requestCancellation(Long orderItemId) {
        OrderItem orderItem = getOrderItemById(orderItemId);
        if (orderItem.getStatus() == OrderStatus.PENDING || orderItem.getStatus() == OrderStatus.PROCESSING) {
            orderItem.setStatus(OrderStatus.CANCELLATION_REQUESTED);
            return orderItemRepository.save(orderItem);
        } else {
            throw new RuntimeException("Cannot request cancellation for order in status: " + orderItem.getStatus());
        }
    }

    public OrderItem updateStatus(Long orderItemId, String status) {
        OrderItem orderItem = getOrderItemById(orderItemId);
        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            orderItem.setStatus(newStatus);
            return orderItemRepository.save(orderItem);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
    }

    public OrderItem approveCancellation(Long orderItemId) {
        OrderItem orderItem = getOrderItemById(orderItemId);
        if (orderItem.getStatus() == OrderStatus.CANCELLATION_REQUESTED) {
            orderItem.setStatus(OrderStatus.CANCELLED);
            return orderItemRepository.save(orderItem);
        } else {
            throw new RuntimeException("Order is not in cancellation requested status");
        }
    }

    public List<OrderItem> searchOrderItems(String status, Long productId, String sortDirection) {
        OrderStatus orderStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid status or handle as needed
            }
        }

        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction
                        .fromString(sortDirection != null ? sortDirection : "DESC"),
                "orderDate");

        return orderItemRepository.searchOrderItems(orderStatus, productId, sort);
    }
}
