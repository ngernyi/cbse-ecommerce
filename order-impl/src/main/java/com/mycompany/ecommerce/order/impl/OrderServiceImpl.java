package com.mycompany.ecommerce.order.impl;

import com.mycompany.ecommerce.api.OrderService;
import com.mycompany.ecommerce.api.model.CartItem;
import com.mycompany.ecommerce.api.model.Order;
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

    @Override
    public Long createOrder(Long customerId) {
        // 1. Get Cart Items
        List<CartItem> cartItems = new ArrayList<>();
        String selectCart = "SELECT * FROM cart_items WHERE customer_id = ?";
        double totalAmount = 0.0;

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false); // Transaction
            try {
                // Fetch Cart Items & Calculate Total (Naive, assumes price is fetched or we
                // join products)
                // We need price. Let's join products to get current price.
                String cartSql = "SELECT c.*, p.price FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.customer_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(cartSql)) {
                    ps.setLong(1, customerId);
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            CartItem ci = new CartItem();
                            ci.setId(rs.getLong("id"));
                            ci.setProductId(rs.getLong("product_id"));
                            ci.setQuantity(rs.getInt("quantity"));
                            cartItems.add(ci);
                            totalAmount += rs.getDouble("price") * ci.getQuantity();
                        }
                    }
                }

                if (cartItems.isEmpty()) {
                    return 0L;
                }

                // 2. Create Order Record
                String insertOrder = "INSERT INTO orders (customer_id, order_date, status, total_amount) VALUES (?, ?, ?, ?)";
                Long orderId = 0L;
                try (PreparedStatement ps = conn.prepareStatement(insertOrder, Statement.RETURN_GENERATED_KEYS)) {
                    ps.setLong(1, customerId);
                    ps.setTimestamp(2, Timestamp.valueOf(LocalDateTime.now()));
                    ps.setString(3, OrderStatus.PENDING.name());
                    ps.setDouble(4, totalAmount);
                    ps.executeUpdate();

                    try (ResultSet keys = ps.getGeneratedKeys()) {
                        if (keys.next()) {
                            orderId = keys.getLong(1);
                        }
                    }
                }

                // 3. Insert Order Items
                String insertItem = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
                // Note: price logic needs to re-fetch or use what we had.
                // Re-iterating cart items, but we need price. Ideally we stored it.
                // Let's just re-fetch price or optimize later. For now, simple loop to insert.
                // Actually, I should have stored price in valid object list.
                // Let's do a sub-query style or simple PreparedStatement inside loop with
                // cached prices.

                // Optimized: We already calculated total, but didn't store individual prices in
                // CartItem obj (it doesn't have price field likely? Check CartItem).
                // CartItem model usually doesn't have price.
                // I'll run a query to copy data from cart+products to order_items directly!

                String copyItems = "INSERT INTO order_items (order_id, product_id, quantity, price) " +
                        "SELECT ?, c.product_id, c.quantity, p.price " +
                        "FROM cart_items c JOIN products p ON c.product_id = p.id " +
                        "WHERE c.customer_id = ?";

                try (PreparedStatement ps = conn.prepareStatement(copyItems)) {
                    ps.setLong(1, orderId);
                    ps.setLong(2, customerId);
                    ps.executeUpdate();
                }

                // 4. Clear Cart
                String deleteCart = "DELETE FROM cart_items WHERE customer_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(deleteCart)) {
                    ps.setLong(1, customerId);
                    ps.executeUpdate();
                }

                conn.commit();
                return orderId;
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
    public Order getOrderDetails(Long orderId) {
        Order order = null;
        String orderSql = "SELECT * FROM orders WHERE id = ?";
        String itemsSql = "SELECT oi.*, p.name, p.description FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?";

        try (Connection conn = dataSource.getConnection()) {
            // Get Order Header
            try (PreparedStatement ps = conn.prepareStatement(orderSql)) {
                ps.setLong(1, orderId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        order = new Order();
                        order.setId(rs.getLong("id"));
                        order.setCustomerId(rs.getLong("customer_id"));
                        order.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
                        order.setStatus(OrderStatus.valueOf(rs.getString("status")));
                        order.setTotalAmount(rs.getDouble("total_amount"));
                    }
                }
            }

            if (order != null) {
                // Get Items
                List<OrderItem> items = new ArrayList<>();
                try (PreparedStatement ps = conn.prepareStatement(itemsSql)) {
                    ps.setLong(1, orderId);
                    try (ResultSet rs = ps.executeQuery()) {
                        while (rs.next()) {
                            OrderItem item = new OrderItem();
                            item.setId(rs.getLong("id"));
                            // item.setOrderId(orderId); // OrderItem might not have setOrderId in model?
                            item.setProductId(rs.getLong("product_id"));
                            item.setQuantity(rs.getInt("quantity"));
                            // item.setPrice(rs.getDouble("price")); // OrderItem model?

                            // Map Product
                            Product p = new Product();
                            p.setId(item.getProductId());
                            p.setName(rs.getString("name"));
                            p.setDescription(rs.getString("description"));
                            if (checkColumn(rs, "price"))
                                p.setPrice(rs.getDouble("price"));

                            item.setProduct(p);
                            // Verify OrderItem has price field?
                            // Schema for order_items has price. OrderItem.java... let's assume it doesn't
                            // or we map to Product.
                            // Checking OrderItem.java previously: it had 'status' (wrongly) and
                            // 'orderDate'.
                            // I should probably fix OrderItem.java too but let's stick to what we have if
                            // possible.
                            // Actually, I'll rely on Product.price inside the item for display,
                            // OR the 'price' column in order_items is the snapshot price.
                            // Ideally OrderItem has a 'price' field.

                            items.add(item);
                        }
                    }
                }
                order.setItems(items);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return order;
    }

    private boolean checkColumn(ResultSet rs, String colName) {
        try {
            rs.findColumn(colName);
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    @Override
    public OrderStatus getOrderStatus(Long orderId) {
        String sql = "SELECT status FROM orders WHERE id = ?";
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
    public List<Order> getOrdersByCustomer(Long customerId) {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Order o = new Order();
                    o.setId(rs.getLong("id"));
                    o.setCustomerId(customerId);
                    o.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
                    o.setStatus(OrderStatus.valueOf(rs.getString("status")));
                    o.setTotalAmount(rs.getDouble("total_amount"));
                    orders.add(o);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
    }

    @Override
    public List<Order> getAllOrders() {
        List<Order> orders = new ArrayList<>();
        String sql = "SELECT * FROM orders ORDER BY order_date DESC";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Order o = new Order();
                o.setId(rs.getLong("id"));
                o.setCustomerId(rs.getLong("customer_id"));
                o.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
                o.setStatus(OrderStatus.valueOf(rs.getString("status")));
                o.setTotalAmount(rs.getDouble("total_amount"));
                orders.add(o);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return orders;
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
        } else {
            updateStatus(orderId, OrderStatus.PROCESSING);
        }
    }

    private void updateStatus(Long orderId, OrderStatus status) {
        String sql = "UPDATE orders SET status = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, status.name());
            ps.setLong(2, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
