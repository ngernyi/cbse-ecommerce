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

        if (Boolean.TRUE.equals(paymentMethod.getIsDefault())) {
            unsetOtherDefaults(customerId, null);
        }

        return paymentMethodRepository.save(paymentMethod);
    }

    public List<PaymentMethod> getPaymentMethodsByCustomerId(Long customerId) {
        return paymentMethodRepository.findByCustomerId(customerId);
    }

    public PaymentMethod updatePaymentMethod(Long id, PaymentMethod updatedMethod) {
        PaymentMethod existingMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment method not found with id: " + id));

        existingMethod.setType(updatedMethod.getType());
        existingMethod.setLast4(updatedMethod.getLast4());
        existingMethod.setBrand(updatedMethod.getBrand());
        existingMethod.setExpiryMonth(updatedMethod.getExpiryMonth());
        existingMethod.setExpiryYear(updatedMethod.getExpiryYear());
        existingMethod.setHolderName(updatedMethod.getHolderName());

        if (Boolean.TRUE.equals(updatedMethod.getIsDefault())) {
            existingMethod.setIsDefault(true);
            unsetOtherDefaults(existingMethod.getCustomer().getId(), id);
        } else {
            existingMethod.setIsDefault(false);
        }

        return paymentMethodRepository.save(existingMethod);
    }

    private void unsetOtherDefaults(Long customerId, Long excludeMethodId) {
        List<PaymentMethod> methods = paymentMethodRepository.findByCustomerId(customerId);
        for (PaymentMethod method : methods) {
            if (!method.getId().equals(excludeMethodId) && Boolean.TRUE.equals(method.getIsDefault())) {
                method.setIsDefault(false);
                paymentMethodRepository.save(method);
            }
        }
    }

    public void deletePaymentMethod(Long id) {
        paymentMethodRepository.deleteById(id);
    }
}
