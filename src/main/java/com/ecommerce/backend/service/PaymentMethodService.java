package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Customer;
import com.ecommerce.backend.entity.PaymentMethod;
import com.ecommerce.backend.repository.CustomerRepository;
import com.ecommerce.backend.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final CustomerRepository customerRepository;

    public PaymentMethodService(PaymentMethodRepository paymentMethodRepository,
            CustomerRepository customerRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.customerRepository = customerRepository;
    }

    public PaymentMethod addPaymentMethod(Long customerId, PaymentMethod paymentMethod) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        paymentMethod.setCustomer(customer);
        return paymentMethodRepository.save(paymentMethod);
    }

    public List<PaymentMethod> getPaymentMethodsByCustomerId(Long customerId) {
        return paymentMethodRepository.findByCustomerId(customerId);
    }

    public PaymentMethod updatePaymentMethod(Long id, PaymentMethod updatedMethod) {
        PaymentMethod existingMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));

        existingMethod.setBankName(updatedMethod.getBankName());
        existingMethod.setAccountNumber(updatedMethod.getAccountNumber());
        existingMethod.setAccountHolderName(updatedMethod.getAccountHolderName());

        return paymentMethodRepository.save(existingMethod);
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}
