package com.mycompany.ecommerce.api;

import com.mycompany.ecommerce.api.model.Address;
import com.mycompany.ecommerce.api.model.Customer;
import com.mycompany.ecommerce.api.model.PaymentMethod;
import com.mycompany.ecommerce.api.model.Wishlist;

import java.util.List;

public interface CustomerService {

    // UC-CA-01 Manage Profile
    Customer getCustomer(Long id);

    void createCustomer(Customer customer);

    void updateCustomer(Customer customer);

    // UC-CA-02 Manage Addresses
    List<Address> getAddresses(Long customerId);

    void addAddress(Address address);

    void updateAddress(Address address);

    void deleteAddress(Long addressId);

    // UC-CA-03 Manage Wishlist
    Wishlist getWishlist(Long customerId);

    void addProductToWishlist(Long customerId, Long productId);

    void removeProductFromWishlist(Long customerId, Long productId);

    // UC-CA-04 Manage Saved Payment Methods
    List<PaymentMethod> getPaymentMethods(Long customerId);

    void addPaymentMethod(PaymentMethod paymentMethod);

    void updatePaymentMethod(PaymentMethod paymentMethod);

    void deletePaymentMethod(Long paymentMethodId);

    // Auth helper
    Customer login(String email, String password);
}
