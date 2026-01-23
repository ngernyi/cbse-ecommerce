package com.mycompany.ecommerce.cart.impl;

import com.mycompany.ecommerce.api.CartService;
import com.mycompany.ecommerce.api.model.CartItem;
import com.mycompany.ecommerce.api.model.Product;
import com.mycompany.ecommerce.api.model.ProductImage;

import javax.sql.DataSource;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CartServiceImpl implements CartService {

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void addToCart(Long customerId, Long productId, int quantity) {
        System.out.println("CartServiceImpl: Adding to cart. Customer=" + customerId + ", Product=" + productId
                + ", Qty=" + quantity);

        // Check if item already exists
        String checkSql = "SELECT id, quantity FROM cart_items WHERE customer_id = ? AND product_id = ?";
        try (Connection conn = dataSource.getConnection()) {
            if (!conn.getAutoCommit()) {
                conn.setAutoCommit(true);
            }
            try (PreparedStatement ps = conn.prepareStatement(checkSql)) {
                ps.setLong(1, customerId);
                ps.setLong(2, productId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) {
                        // Update quantity
                        Long cartItemId = rs.getLong("id");
                        int existingQty = rs.getInt("quantity");
                        System.out.println("CartServiceImpl: Updating existing item " + cartItemId);
                        updateCartItemQuantity(cartItemId, existingQty + quantity);
                    } else {
                        // Insert new
                        System.out.println("CartServiceImpl: Inserting new item");
                        String insertSql = "INSERT INTO cart_items (customer_id, product_id, quantity) VALUES (?, ?, ?)";
                        try (PreparedStatement insertPs = conn.prepareStatement(insertSql)) {
                            insertPs.setLong(1, customerId);
                            insertPs.setLong(2, productId);
                            insertPs.setInt(3, quantity);
                            int rows = insertPs.executeUpdate();
                            System.out.println("CartServiceImpl: Insert rows: " + rows);
                        }
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("CartServiceImpl DB Error: " + e.getMessage());
            throw new RuntimeException("DB Error: " + e.getMessage());
        }
    }

    @Override
    public List<CartItem> getCart(Long customerId) {
        List<CartItem> list = new ArrayList<>();
        // Join with products
        String sql = "SELECT ci.*, p.name, p.price, p.description, p.rating, p.category FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.customer_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CartItem item = new CartItem();
                    item.setId(rs.getLong("id"));
                    item.setCustomerId(rs.getLong("customer_id"));
                    item.setProductId(rs.getLong("product_id"));
                    item.setQuantity(rs.getInt("quantity"));
                    // item.setAddedAt(rs.getTimestamp("added_at").toLocalDateTime()); // Removed:
                    // Column missing in DB

                    // Map product details
                    Product p = new Product();
                    p.setId(item.getProductId());
                    p.setName(rs.getString("name"));
                    p.setPrice(rs.getDouble("price"));
                    p.setDescription(rs.getString("description"));
                    p.setRating(rs.getDouble("rating"));
                    // Optional: fetch images if needed, skipping for brevity
                    item.setProduct(p);

                    list.add(item);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void updateCartItemQuantity(Long cartItemId, int quantity) {
        if (quantity <= 0) {
            removeCartItem(cartItemId);
            return;
        }
        String sql = "UPDATE cart_items SET quantity = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setLong(2, cartItemId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void removeCartItem(Long cartItemId) {
        String sql = "DELETE FROM cart_items WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartItemId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void clearCart(Long customerId) {
        String sql = "DELETE FROM cart_items WHERE customer_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public double applyCoupon(Long customerId, String couponCode) {
        // Mock coupon logic
        if ("DISCOUNT10".equals(couponCode)) {
            return 10.0;
        }
        return 0.0;
    }

    @Override
    public double getCartTotal(Long customerId) {
        double total = 0.0;
        List<CartItem> items = getCart(customerId);
        for (CartItem item : items) {
            if (item.getProduct() != null) {
                total += item.getProduct().getPrice() * item.getQuantity();
            }
        }
        return total;
    }
}
