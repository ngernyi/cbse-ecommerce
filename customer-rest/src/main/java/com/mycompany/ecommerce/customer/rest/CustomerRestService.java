package com.mycompany.ecommerce.customer.rest;

import com.mycompany.ecommerce.api.CustomerService;
import com.mycompany.ecommerce.api.model.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class CustomerRestService {

    private CustomerService customerService;

    public void setCustomerService(CustomerService customerService) {
        this.customerService = customerService;
    }

    // ==================== Profile Management ====================

    @GET
    @Path("/{id}")
    public Customer getCustomer(@PathParam("id") Long id) {
        return customerService.getCustomer(id);
    }

    @PUT
    @Path("/{id}")
    public void updateCustomer(@PathParam("id") Long id, Customer customer) {
        customer.setId(id);
        customerService.updateCustomer(customer);
    }

    // ==================== Auth ====================

    @POST
    @Path("/login")
    public Customer login(LoginRequest request) {
        Customer c = customerService.login(request.getEmail(), request.getPassword());
        if (c == null) {
            throw new WebApplicationException(javax.ws.rs.core.Response.Status.UNAUTHORIZED);
        }
        return c;
    }

    @POST
    @Path("/register")
    public Customer register(Customer customer) {
        // Simple registration logic
        if (customer.getName() == null || customer.getEmail() == null || customer.getPassword() == null) {
            throw new WebApplicationException("Missing required fields", 400);
        }

        customerService.createCustomer(customer); // Now exists in interface

        // Return created customer (with ID)
        return customer;
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // ==================== Address Management ====================

    @GET
    @Path("/{customerId}/addresses")
    public List<Address> getAddresses(@PathParam("customerId") Long customerId) {
        return customerService.getAddresses(customerId);
    }

    @POST
    @Path("/{customerId}/addresses")
    public Address addAddress(@PathParam("customerId") Long customerId, Address address) {
        address.setCustomerId(customerId);
        customerService.addAddress(address);
        return address;
    }

    @PUT
    @Path("/{customerId}/addresses/{addressId}")
    public void updateAddress(@PathParam("customerId") Long customerId, @PathParam("addressId") Long addressId,
            Address address) {
        address.setId(addressId);
        address.setCustomerId(customerId);
        customerService.updateAddress(address);
    }

    @DELETE
    @Path("/{customerId}/addresses/{addressId}")
    public void deleteAddress(@PathParam("customerId") Long customerId, @PathParam("addressId") Long addressId) {
        customerService.deleteAddress(addressId);
    }

    // ==================== Wishlist Management ====================

    @GET
    @Path("/{customerId}/wishlist")
    public Wishlist getWishlist(@PathParam("customerId") Long customerId) {
        return customerService.getWishlist(customerId);
    }

    @POST
    @Path("/{customerId}/wishlist/{productId}")
    public void addToWishlist(@PathParam("customerId") Long customerId, @PathParam("productId") Long productId) {
        customerService.addProductToWishlist(customerId, productId);
    }

    @DELETE
    @Path("/{customerId}/wishlist/{productId}")
    public void removeFromWishlist(@PathParam("customerId") Long customerId, @PathParam("productId") Long productId) {
        customerService.removeProductFromWishlist(customerId, productId);
    }

    // ==================== Payment Methods Management ====================

    @GET
    @Path("/{customerId}/payment-methods")
    public List<PaymentMethod> getPaymentMethods(@PathParam("customerId") Long customerId) {
        return customerService.getPaymentMethods(customerId);
    }

    @POST
    @Path("/{customerId}/payment-methods")
    public void addPaymentMethod(@PathParam("customerId") Long customerId, PaymentMethod paymentMethod) {
        paymentMethod.setCustomerId(customerId);
        customerService.addPaymentMethod(paymentMethod);
    }

    @PUT
    @Path("/{customerId}/payment-methods/{paymentMethodId}")
    public void updatePaymentMethod(@PathParam("customerId") Long customerId,
            @PathParam("paymentMethodId") Long paymentMethodId, PaymentMethod paymentMethod) {
        paymentMethod.setId(paymentMethodId);
        paymentMethod.setCustomerId(customerId);
        customerService.updatePaymentMethod(paymentMethod);
    }

    @DELETE
    @Path("/{customerId}/payment-methods/{paymentMethodId}")
    public void deletePaymentMethod(@PathParam("customerId") Long customerId,
            @PathParam("paymentMethodId") Long paymentMethodId) {
        customerService.deletePaymentMethod(paymentMethodId);
    }
}
