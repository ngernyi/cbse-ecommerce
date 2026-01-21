package com.mycompany.ecommerce.customer.rest;

import com.mycompany.ecommerce.api.customer.CustomerService;
import com.mycompany.ecommerce.api.model.Customer;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/customers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CustomerRestService {

    private CustomerService customerService;

    public void setCustomerService(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GET
    @Path("/{id}")
    public Customer getCustomer(@PathParam("id") String id) {
        return customerService.getCustomerById(id);
    }

    @POST
    public void updateCustomer(Customer customer) {
        customerService.updateCustomer(customer);
    }
}
