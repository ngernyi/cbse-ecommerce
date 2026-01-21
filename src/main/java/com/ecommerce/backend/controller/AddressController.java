package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.service.AddressService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/customer/{customerId}")
    public Address addAddress(@PathVariable String customerId, @RequestBody Address address) {
        return addressService.addAddress(Long.parseLong(customerId), address);
    }

    @GetMapping("/customer/{customerId}")
    public List<Address> getAddressesByCustomer(@PathVariable String customerId) {
        return addressService.getAddressesByCustomerId(Long.parseLong(customerId));
    }

    @GetMapping("/{id}")
    public Address getAddressById(@PathVariable String id) {
        return addressService.getAddressById(Long.parseLong(id));
    }

    @PutMapping("/{id}")
    public Address updateAddress(@PathVariable String id, @RequestBody Address address) {
        return addressService.updateAddress(Long.parseLong(id), address);
    }

    @DeleteMapping("/{id}")
    public void deleteAddress(@PathVariable String id) {
        addressService.deleteAddress(Long.parseLong(id));
    }
}
