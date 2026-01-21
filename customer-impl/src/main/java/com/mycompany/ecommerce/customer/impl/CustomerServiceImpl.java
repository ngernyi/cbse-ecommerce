package com.mycompany.ecommerce.customer.impl;

import com.mycompany.ecommerce.api.CustomerService;
import com.mycompany.ecommerce.api.model.*;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class CustomerServiceImpl implements CustomerService {

    private DataSource dataSource;

    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // ==================== Profile Management (UC-CA-01) ====================

    @Override
    public Customer getCustomer(Long id) {
        String sql = "SELECT * FROM customers WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapCustomer(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void createCustomer(Customer customer) {
        String sql = "INSERT INTO customers (name, email, password, phone) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPassword());
            ps.setString(4, customer.getPhone());
            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    customer.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateCustomer(Customer customer) {
        String sql = "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, customer.getName());
            ps.setString(2, customer.getEmail());
            ps.setString(3, customer.getPhone());
            ps.setLong(4, customer.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Customer login(String email, String password) {
        String sql = "SELECT * FROM customers WHERE email = ? AND password = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, email);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapCustomer(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Customer mapCustomer(ResultSet rs) throws SQLException {
        Customer c = new Customer();
        c.setId(rs.getLong("id"));
        c.setName(rs.getString("name"));
        c.setEmail(rs.getString("email"));
        c.setPassword(rs.getString("password"));
        c.setPhone(rs.getString("phone"));
        return c;
    }

    // ==================== Address Management (UC-CA-02) ====================

    @Override
    public List<Address> getAddresses(Long customerId) {
        List<Address> list = new ArrayList<>();
        String sql = "SELECT * FROM addresses WHERE customer_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapAddress(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void addAddress(Address address) {
        String sql = "INSERT INTO addresses (street, city, state, zip_code, country, customer_id) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, address.getStreet());
            ps.setString(2, address.getCity());
            ps.setString(3, address.getState());
            ps.setString(4, address.getZipCode());
            ps.setString(5, address.getCountry());
            ps.setLong(6, address.getCustomerId());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updateAddress(Address address) {
        String sql = "UPDATE addresses SET street = ?, city = ?, state = ?, zip_code = ?, country = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, address.getStreet());
            ps.setString(2, address.getCity());
            ps.setString(3, address.getState());
            ps.setString(4, address.getZipCode());
            ps.setString(5, address.getCountry());
            ps.setLong(6, address.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deleteAddress(Long addressId) {
        String sql = "DELETE FROM addresses WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, addressId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Address mapAddress(ResultSet rs) throws SQLException {
        Address a = new Address();
        a.setId(rs.getLong("id"));
        a.setStreet(rs.getString("street"));
        a.setCity(rs.getString("city"));
        a.setState(rs.getString("state"));
        a.setZipCode(rs.getString("zip_code"));
        a.setCountry(rs.getString("country"));
        a.setCustomerId(rs.getLong("customer_id"));
        return a;
    }

    // ==================== Wishlist Management (UC-CA-03) ====================

    @Override
    public Wishlist getWishlist(Long customerId) {
        // Assume 1 wishlist per customer for now
        String sql = "SELECT * FROM wishlists WHERE customer_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Wishlist w = new Wishlist();
                    w.setId(rs.getLong("id"));
                    w.setName(rs.getString("name"));
                    w.setCustomerId(rs.getLong("customer_id"));
                    w.setProducts(getWishlistProducts(w.getId()));
                    return w;
                } else {
                    // Create default wishlist if none
                    createWishlist(customerId, "Default Wishlist");
                    return getWishlist(customerId); // recurse once
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void createWishlist(Long customerId, String name) throws SQLException {
        String sql = "INSERT INTO wishlists (customer_id, name) VALUES (?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            ps.setString(2, name);
            ps.executeUpdate();
        }
    }

    private List<Product> getWishlistProducts(Long wishlistId) {
        List<Product> products = new ArrayList<>();
        // Join with products table to get details
        String sql = "SELECT p.* FROM products p JOIN wishlist_products wp ON p.id = wp.product_id WHERE wp.wishlist_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, wishlistId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Product p = new Product();
                    p.setId(rs.getLong("id"));
                    p.setName(rs.getString("name"));
                    p.setPrice(rs.getDouble("price"));
                    p.setDescription(rs.getString("description"));
                    // ... other fields
                    products.add(p);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return products;
    }

    @Override
    public void addProductToWishlist(Long customerId, Long productId) {
        Wishlist w = getWishlist(customerId);
        if (w == null)
            return;

        // Check if already exists to avoid dupes or PK violation
        String checkSql = "SELECT 1 FROM wishlist_products WHERE wishlist_id = ? AND product_id = ?";
        String insertSql = "INSERT INTO wishlist_products (wishlist_id, product_id) VALUES (?, ?)";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement checkPs = conn.prepareStatement(checkSql)) {
            checkPs.setLong(1, w.getId());
            checkPs.setLong(2, productId);
            try (ResultSet rs = checkPs.executeQuery()) {
                if (!rs.next()) {
                    try (PreparedStatement insertPs = conn.prepareStatement(insertSql)) {
                        insertPs.setLong(1, w.getId());
                        insertPs.setLong(2, productId);
                        insertPs.executeUpdate();
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void removeProductFromWishlist(Long customerId, Long productId) {
        Wishlist w = getWishlist(customerId);
        if (w == null)
            return;

        String sql = "DELETE FROM wishlist_products WHERE wishlist_id = ? AND product_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, w.getId());
            ps.setLong(2, productId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // ==================== Payment Methods (UC-CA-04) ====================

    @Override
    public List<PaymentMethod> getPaymentMethods(Long customerId) {
        List<PaymentMethod> list = new ArrayList<>();
        String sql = "SELECT * FROM payment_methods WHERE customer_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, customerId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapPaymentMethod(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public void addPaymentMethod(PaymentMethod pm) {
        String sql = "INSERT INTO payment_methods (bank_name, account_number, account_holder_name, customer_id) VALUES (?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, pm.getBankName());
            ps.setString(2, pm.getAccountNumber());
            ps.setString(3, pm.getAccountHolderName());
            ps.setLong(4, pm.getCustomerId());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void updatePaymentMethod(PaymentMethod pm) {
        String sql = "UPDATE payment_methods SET bank_name = ?, account_number = ?, account_holder_name = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, pm.getBankName());
            ps.setString(2, pm.getAccountNumber());
            ps.setString(3, pm.getAccountHolderName());
            ps.setLong(4, pm.getId());
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void deletePaymentMethod(Long pmId) {
        String sql = "DELETE FROM payment_methods WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, pmId);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private PaymentMethod mapPaymentMethod(ResultSet rs) throws SQLException {
        PaymentMethod pm = new PaymentMethod();
        pm.setId(rs.getLong("id"));
        pm.setBankName(rs.getString("bank_name"));
        pm.setAccountNumber(rs.getString("account_number"));
        pm.setAccountHolderName(rs.getString("account_holder_name"));
        pm.setCustomerId(rs.getLong("customer_id"));
        return pm;
    }
}
