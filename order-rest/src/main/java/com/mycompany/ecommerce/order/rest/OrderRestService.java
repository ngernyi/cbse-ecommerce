package com.mycompany.ecommerce.order.rest;

import com.mycompany.ecommerce.api.OrderService;
import com.mycompany.ecommerce.api.model.OrderItem;
import com.mycompany.ecommerce.api.model.OrderStatus;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/orders")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class OrderRestService {

    private OrderService orderService;

    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    // ==================== Checkout ====================

    @POST
    @Path("/{customerId}/checkout")
    public Long checkout(@PathParam("customerId") Long customerId) {
        return orderService.createOrder(customerId);
    }

    // ==================== Order History & Details ====================

    @GET
    @Path("/{customerId}")
    public List<Long> getOrders(@PathParam("customerId") Long customerId) {
        return orderService.getOrdersByCustomer(customerId);
    }

    @GET
    @Path("/details/{orderId}")
    public List<OrderItem> getOrderDetails(@PathParam("orderId") Long orderId) {
        return orderService.getOrderDetails(orderId);
    }

    // ==================== Tracking ====================

    @GET
    @Path("/{orderId}/status")
    public OrderStatus getStatus(@PathParam("orderId") Long orderId) {
        return orderService.getOrderStatus(orderId);
    }

    // ==================== Usage: Cancellation ====================

    @POST
    @Path("/{orderId}/cancel")
    public boolean requestCancellation(@PathParam("orderId") Long orderId) {
        return orderService.requestCancellation(orderId);
    }

    @POST
    @Path("/{orderId}/process-cancellation")
    public void processCancellation(@PathParam("orderId") Long orderId, @QueryParam("approve") boolean approve) {
        orderService.processCancellation(orderId, approve);
    }
}
