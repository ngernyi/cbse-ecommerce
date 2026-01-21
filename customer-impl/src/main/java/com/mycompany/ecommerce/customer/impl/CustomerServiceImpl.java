package com.mycompany.ecommerce.customer.impl;

import com.mycompany.ecommerce.api.customer.CustomerService;
import com.mycompany.ecommerce.api.model.Customer;

public class CustomerServiceImpl implements CustomerService {

    @Override
    public Customer getCustomerById(String id) {
        // Dummy implementation
        System.out.println("Fetching customer with ID: " + id);
        return new Customer(id, "John Doe", "john.doe@example.com");
    }

    @Override
    public void updateCustomer(Customer customer) {
        // Dummy implementation
        System.out.println("Updating customer: " + customer.getName());
        // In a real implementation, you would save this to the database.
    }
}
