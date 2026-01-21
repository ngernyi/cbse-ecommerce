package com.mycompany.ecommerce.order.impl;

import com.mycompany.ecommerce.api.OrderService;
import com.mycompany.ecommerce.api.model.CartItem;
import com.mycompany.ecommerce.api.model.OrderItem;
import com.mycompany.ecommerce.api.model.OrderStatus;
import com.mycompany.ecommerce.api.model.Product;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderServiceImpl implements OrderService {

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // Reuse cart logic or inject CartService? Better to do it in DB directly to be atomic.
    // Or assume CartService is unavailable and select table manually.

    @Override
    public Long createOrder(Long customerId) {
        // "checkout" implementation
        // 1. Get Cart Items
        List<CartItem> cartItems = new ArrayList<>();
        String selectCart = "SELECT * FROM cart_items WHERE customer_id = ?";
        
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Transaction
            try {
                try (PreparedStatement ps = conn.prepareStatement(selectCart)) {
                    ps.setLong(1, customerId);
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            CartItem ci = new CartItem();
                            ci.setId(rs.getLong("id"));
                            ci.setProductId(rs.getLong("product_id"));
                            ci.setQuantity(rs.getInt("quantity"));
                            cartItems.add(ci);
                        }
                    }
                }

                if (cartItems.isEmpty()) {
                    return 0L; // Nothing to order
                }

                // 2. Insert Order Items
                String insertOrder = "INSERT INTO order_items (customer_id, product_id, quantity, status, order_date) VALUES (?, ?, ?, ?, ?)";
                Long lastId = 0L;

                try (PreparedStatement ps = conn.prepareStatement(insertOrder, Statement.RETURN_GENERATED_KEYS)) {
                    for (CartItem ci : cartItems) {
                        ps.setLong(1, customerId);
                        ps.setLong(2, ci.getProductId());
                        ps.setInt(3, ci.getQuantity());
                        ps.setString(4, OrderStatus.PENDING.name());
                        ps.setTimestamp(5, Timestamp.valueOf(LocalDateTime.now()));
                        ps.addBatch();
                    }
                    ps.executeBatch();
                    
                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        while (keys.next()) {
                            lastId = keys.getLong(1);
                        }
                    }
                }

                // 3. Clear Cart
                String deleteCart = "DELETE FROM cart_items WHERE customer_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(deleteCart)) {
                    ps.setLong(1, customerId);
                    ps.executeUpdate();
                }

                conn.commit();
                return lastId; // Return ID of last item as "Order ID" reference logic
            } catch (SQLException e) {
                conn.rollback();
                throw e;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0L;
    }

    @Override
    public List<OrderItem> getOrderDetails(Long orderId) {
        // Assuming orderId = OrderItem.id (Line item view)
        List<OrderItem> list = new ArrayList<>();
        String sql = "SELECT oi.*, p.name, p.price, p.description FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    list.add(mapOrderItem(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public OrderStatus getOrderStatus(Long orderId) {
        String sql = "SELECT status FROM order_items WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return OrderStatus.valueOf(rs.getString("status"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public List<Long> getOrdersByCustomer(Long customerId) {
        List<Long> ids = new ArrayList<>();
        String sql = "SELECT id FROM order_items WHERE customer_id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ids.add(rs.getLong("id"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ids;
    }

    @Override
    public boolean requestCancellation(Long orderId) {
        OrderStatus status = getOrderStatus(orderId);
        if (status == OrderStatus.PROCESSING || status == OrderStatus.PENDING) {
            updateStatus(orderId, OrderStatus.CANCELLATION_REQUESTED);
            return true;
        }
        return false;
    }

    @Override
    public void processCancellation(Long orderId, boolean approve) {
        if (approve) {
            updateStatus(orderId, OrderStatus.CANCELLED);
            // Restore inventory if we were tracking it
        } else {
            // Revert to processing or previous state. Assuming Processing.
            updateStatus(orderId, OrderStatus.PROCESSING);
        }
    }

    private void updateStatus(Long orderId, OrderStatus status) {
        String sql = "UPDATE order_items SET status = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status.name());
            ps.setLong(2, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private OrderItem mapOrderItem(ResultSet rs) throws SQLException {
        OrderItem item = new OrderItem();
        item.setId(rs.getLong("id"));
        item.setCustomerId(rs.getLong("customer_id"));
        item.setProductId(rs.getLong("product_id"));
        item.setQuantity(rs.getInt("quantity"));
        item.setStatus(OrderStatus.valueOf(rs.getString("status")));
        item.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());

        Product p = new Product();
        p.setId(item.getProductId());
        p.setName(rs.getString("name"));
        p.setPrice(rs.getDouble("price"));
        p.setDescription(rs.getString("description"));
        item.setProduct(p);

        return item;
    }
}
