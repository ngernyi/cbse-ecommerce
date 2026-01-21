package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.OrderItem;
import com.mycompany.ecommerce.api.model.OrderStatus;

import java.util.List;

public interface OrderService {

    // Create Order from Cart
    Long createOrder(Long customerId); // Returns Order ID

    // UC-OM-01 View Order Details
    List<OrderItem> getOrderDetails(Long orderId);

    // UC-OM-02 Track Order Status
    OrderStatus getOrderStatus(Long orderId);

    List<Long> getOrdersByCustomer(Long customerId); // Helper to find orders

    // UC-OM-03 Request Cancellation
    boolean requestCancellation(Long orderId);

    // UC-OM-04 Process Cancellation (Admin)
    void processCancellation(Long orderId, boolean approve);

    // Need a way to represent the 'Order' itself (group of items),
    // but the models only had OrderItem.
    // In a real system we'd have an Order entity.
    // Given the entities provided, OrderItem has orderDate but no grouping ID other
    // than maybe implicit?
    // Wait, OrderItem table usually links to an Order table.
    // The provided OrderItem.java didn't have an Order link, just customer.
    // This implies flattened structure or missing entity.
    // I shall check if there was an Order.java I missed, or I should create one.
    // The previous 'ls' of entity dir showed: Address, CartItem, Category,
    // Customer, OrderItem, OrderStatus, PaymentMethod, Product, ProductImage,
    // Wishlist.
    // NO 'Order.java'.
    // This is strange for "View Order Details" (UC-OM-01).
    // "Goal: Display full details of a past order (Items, Price, Status)."
    // If OrderItem has 'status' and 'orderDate', maybe each item is treated as an
    // individual order?
    // Or they are grouped by some query.
    // I will assume for now we might need to group them by (Customer + Date) or I
    // should create an Order model to be sane.
    // But the prompt said "Take out the files you need from springboot...
    // springboot develop according to use case".
    // If springboot didn't have Order entity, maybe it treats OrderItem as lines.
    // Let's create a simple Order model in API to wrap the response.
}
