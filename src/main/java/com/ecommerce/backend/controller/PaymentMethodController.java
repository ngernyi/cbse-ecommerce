package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.PaymentMethod;
import com.ecommerce.backend.service.PaymentMethodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment-methods")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    public PaymentMethodController(PaymentMethodService paymentMethodService) {
        this.paymentMethodService = paymentMethodService;
    }

    @PostMapping("/customer/{customerId}")
    public PaymentMethod addPaymentMethod(@PathVariable String customerId, @RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.addPaymentMethod(Long.parseLong(customerId), paymentMethod);
    }

    @GetMapping("/customer/{customerId}")
    public List<PaymentMethod> getPaymentMethods(@PathVariable String customerId) {
        return paymentMethodService.getPaymentMethodsByCustomerId(Long.parseLong(customerId));
    }

    @PutMapping("/{id}")
    public PaymentMethod updatePaymentMethod(@PathVariable String id, @RequestBody PaymentMethod paymentMethod) {
        return paymentMethodService.updatePaymentMethod(Long.parseLong(id), paymentMethod);
    }

    @DeleteMapping("/{id}")
    public void deletePaymentMethod(@PathVariable String id) {
        paymentMethodService.deletePaymentMethod(Long.parseLong(id));
    }
}
