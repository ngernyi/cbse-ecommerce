package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByCustomerId(Long customerId);

    List<OrderItem> findByStatus(OrderStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT o FROM OrderItem o WHERE (:status IS NULL OR o.status = :status) AND (:productId IS NULL OR o.product.id = :productId)")
    List<OrderItem> searchOrderItems(@org.springframework.data.repository.query.Param("status") OrderStatus status,
            @org.springframework.data.repository.query.Param("productId") Long productId,
            org.springframework.data.domain.Sort sort);
}
