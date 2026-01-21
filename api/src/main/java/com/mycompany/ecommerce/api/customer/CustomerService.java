package com.mycompany.ecommerce.api.customer;

import com.mycompany.ecommerce.api.model.Customer;

public interface CustomerService {

    Customer getCustomerById(String id);

    void updateCustomer(Customer customer);
    
}
