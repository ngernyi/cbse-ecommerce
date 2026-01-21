package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.service.OrderItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping("/customer/{customerId}")
    public OrderItem createOrderItem(@PathVariable String customerId, @RequestBody Map<String, Object> payload) {
        Long productId = Long.parseLong(payload.get("productId").toString());
        Integer quantity = Integer.parseInt(payload.get("quantity").toString());
        return orderItemService.createOrderItem(Long.parseLong(customerId), productId, quantity);
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderItem> getOrderItems(@PathVariable String customerId) {
        return orderItemService.getOrderItemsByCustomerId(Long.parseLong(customerId));
    }

    @GetMapping("/{id}")
    public OrderItem getOrderItem(@PathVariable String id) {
        return orderItemService.getOrderItemById(Long.parseLong(id));
    }

    @PostMapping("/{id}/cancel-request")
    public OrderItem requestCancellation(@PathVariable String id) {
        return orderItemService.requestCancellation(Long.parseLong(id));
    }

    @PutMapping("/{id}/status")
    public OrderItem updateStatus(@PathVariable String id, @RequestParam String status) {
        return orderItemService.updateStatus(Long.parseLong(id), status);
    }

    @PostMapping("/{id}/approve-cancellation")
    public OrderItem approveCancellation(@PathVariable String id) {
        return orderItemService.approveCancellation(Long.parseLong(id));
    }

    @GetMapping("/search")
    public List<OrderItem> searchOrderItems(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String productId,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        Long pId = productId != null ? Long.parseLong(productId) : null;
        return orderItemService.searchOrderItems(status, pId, sortDirection);
    }
}
