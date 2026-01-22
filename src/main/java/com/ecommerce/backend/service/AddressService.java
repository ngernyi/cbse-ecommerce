package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Address;
import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.repository.AddressRepository;
import com.ecommerce.backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final CustomerRepository customerRepository;

    public AddressService(AddressRepository addressRepository, CustomerRepository customerRepository) {
        this.addressRepository = addressRepository;
        this.customerRepository = customerRepository;
    }

    public Address addAddress(Long customerId, Address address) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        address.setCustomer(customer);

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            unsetOtherDefaults(customerId, null);
        }

        return addressRepository.save(address);
    }

    public List<Address> getAddressesByCustomerId(Long customerId) {
        return addressRepository.findByCustomerId(customerId);
    }

    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }

    public Address updateAddress(Long id, Address addressDetails) {
        Address address = getAddressById(id);

        address.setLabel(addressDetails.getLabel());
        address.setFullName(addressDetails.getFullName());
        address.setStreet(addressDetails.getStreet());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setZipCode(addressDetails.getZipCode());
        address.setCountry(addressDetails.getCountry());

        if (Boolean.TRUE.equals(addressDetails.getIsDefault())) {
            address.setIsDefault(true);
            unsetOtherDefaults(address.getCustomer().getId(), id);
        } else {
            address.setIsDefault(false);
        }

        return addressRepository.save(address);
    }

    private void unsetOtherDefaults(Long customerId, Long excludeAddressId) {
        List<Address> addresses = addressRepository.findByCustomerId(customerId);
        for (Address addr : addresses) {
            if (!addr.getId().equals(excludeAddressId) && Boolean.TRUE.equals(addr.getIsDefault())) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}
