package com.mycompany.ecommerce.api.customer;

import com.mycompany.ecommerce.api.model.Customer;
import com.mycompany.ecommerce.api.model.Address;
import com.mycompany.ecommerce.api.model.Wishlist;
import com.mycompany.ecommerce.api.model.PaymentMethod;
import java.util.List;

public interface CustomerService {

    // Profile Management (UC-CA-01)
    Customer getCustomerById(String id);

    void updateCustomer(Customer customer);

    // Address Management (UC-CA-02)
    List<Address> getAddresses(String customerId);

    Address addAddress(String customerId, Address address);

    Address updateAddress(String customerId, Address address);

    void deleteAddress(String customerId, String addressId);

    // Wishlist Management (UC-CA-03)
    Wishlist getWishlist(String customerId);

    void addToWishlist(String customerId, String productId);

    void removeFromWishlist(String customerId, String productId);

    // Payment Methods Management (UC-CA-04)
    List<PaymentMethod> getPaymentMethods(String customerId);

    PaymentMethod addPaymentMethod(String customerId, PaymentMethod paymentMethod);

    PaymentMethod updatePaymentMethod(String customerId, PaymentMethod paymentMethod);

    void deletePaymentMethod(String customerId, String paymentMethodId);
    
}

