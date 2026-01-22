package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.Order;
import com.mycompany.ecommerce.api.model.OrderItem;
import com.mycompany.ecommerce.api.model.OrderStatus;

import java.util.List;

public interface OrderService {

    // Create Order from Cart
    Long createOrder(Long customerId); // Returns Order ID

    // UC-OM-01 View Order Details
    Order getOrderDetails(Long orderId);

    // UC-OM-02 Track Order Status
    OrderStatus getOrderStatus(Long orderId);

    List<Order> getOrdersByCustomer(Long customerId);

    // Admin: View All Orders
    List<Order> getAllOrders();

    // UC-OM-03 Request Cancellation
    boolean requestCancellation(Long orderId);

    // UC-OM-04 Process Cancellation (Admin)
    void processCancellation(Long orderId, boolean approve);
}
