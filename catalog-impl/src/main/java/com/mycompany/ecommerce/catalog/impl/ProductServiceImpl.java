package com.mycompany.ecommerce.catalog.impl;

import com.mycompany.ecommerce.api.ProductService;
import com.mycompany.ecommerce.api.model.Category;
import com.mycompany.ecommerce.api.model.Product;
import com.mycompany.ecommerce.api.model.ProductImage;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductServiceImpl implements ProductService {

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // ==================== Search Products (UC-CS-01) ====================

    @Override
    public List<Product> getAllProducts() {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(mapProduct(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        List<Product> list = new ArrayList<>();
        String sql = "SELECT * FROM products WHERE name LIKE ? OR description LIKE ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            String pattern = "%" + keyword + "%";
            ps.setString(1, pattern);
            ps.setString(2, pattern);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapProduct(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // ==================== Browse Categories (UC-CS-02) ====================

    @Override
    public List<Category> getAllCategories() {
        List<Category> list = new ArrayList<>();
        String sql = "SELECT * FROM categories";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Category c = new Category();
                c.setId(rs.getLong("id"));
                c.setName(rs.getString("name"));
                c.setDescription(rs.getString("description"));
                list.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        List<Product> list = new ArrayList<>();
        // Join product_categories table
        String sql = "SELECT p.* FROM products p JOIN product_categories pc ON p.id = pc.product_id WHERE pc.category_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapProduct(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    // ==================== View Recommendations (UC-CS-03) ====================

    @Override
    public List<Product> getRecommendations(Long customerId) {
        List<Product> list = new ArrayList<>();

        if (customerId != null) {
            String sql = "SELECT DISTINCT p.* FROM products p " +
                    "WHERE p.category IN (" +
                    "    SELECT p2.category FROM products p2 " +
                    "    JOIN wishlist_products wp ON p2.id = wp.product_id " +
                    "    JOIN wishlists w ON wp.wishlist_id = w.id " +
                    "    WHERE w.customer_id = ? " +
                    "    UNION " +
                    "    SELECT p3.category FROM products p3 " +
                    "    JOIN order_items oi ON p3.id = oi.product_id " +
                    "    JOIN orders o ON oi.order_id = o.id " +
                    "    WHERE o.customer_id = ? " +
                    ") " +
                    "ORDER BY RAND() LIMIT 5";

            try (Connection conn = dataSource.getConnection();
                    PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setLong(1, customerId);
                ps.setLong(2, customerId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        list.add(mapProduct(rs));
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // Fallback to random if no results or no customerId
        if (list.isEmpty()) {
            String sql = "SELECT * FROM products ORDER BY RAND() LIMIT 5";
            try (Connection conn = dataSource.getConnection();
                    PreparedStatement ps = conn.prepareStatement(sql);
                    ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapProduct(rs));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return list;
    }

    // ==================== Get Product Details ====================

    @Override
    public Product getProduct(Long id) {
        String sql = "SELECT * FROM products WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapProduct(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Product mapProduct(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setName(rs.getString("name"));
        p.setPrice(rs.getDouble("price"));
        p.setRating(rs.getDouble("rating"));
        p.setDescription(rs.getString("description"));
        p.setCategory(rs.getString("category"));
        if (checkColumn(rs, "weight"))
            p.setWeight(rs.getDouble("weight"));
        if (checkColumn(rs, "dimensions"))
            p.setDimensions(rs.getString("dimensions"));
        if (checkColumn(rs, "variants"))
            p.setVariants(rs.getString("variants"));

        // Ideally fetch images too, but for list view we might skip or do eager fetch
        // in separate query
        p.setImages(getProductImages(p.getId()));
        return p;
    }

    private List<ProductImage> getProductImages(Long productId) {
        List<ProductImage> list = new ArrayList<>();
        String sql = "SELECT * FROM product_images WHERE product_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ProductImage pi = new ProductImage();
                    pi.setId(rs.getLong("id"));
                    pi.setImageUrl(rs.getString("image_url"));
                    pi.setProductId(rs.getLong("product_id"));
                    list.add(pi);
                }
            }
        } catch (SQLException e) {
            // Suppress or log
        }
        return list;
    }

    private boolean checkColumn(ResultSet rs, String colName) {
        try {
            rs.findColumn(colName);
            return true;
        } catch (SQLException e) {
            return false;
        }
    }
}
