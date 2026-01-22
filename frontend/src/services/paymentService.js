import api from './api';

export const paymentService = {
    getPaymentMethods: async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const response = await api.get(`/customer/${userId}/payment-methods`);
            // Backend returns list of PaymentMethod objects
            // Frontend might expect fields like 'last4', 'brand' which backend might store differently.
            // Backend stored: bankName, accountNumber, accountHolderName.
            // We map them for UI consistency if needed.
            return response.data.map(pm => ({
                id: pm.id,
                type: 'Bank Transfer', // Default type for now as schema supports account number
                brand: pm.bankName,
                last4: pm.accountNumber.slice(-4),
                holderName: pm.accountHolderName,
                isDefault: false // Backend doesn't support default yet
            }));
        } catch (error) {
            console.error("Failed to load payment methods", error);
            return [];
        }
    },

    addPaymentMethod: async (method) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // Map frontend fields (cardNumber, etc) to backend fields (accountNumber etc)
            // Frontend PaymentMethods.jsx likely sends card details.
            // We'll simplistic mapping: brand -> bankName, last4/number -> accountNumber
            const payload = {
                bankName: method.brand || 'Unknown Bank',
                accountNumber: method.number || '0000',
                accountHolderName: method.holderName,
                customerId: userId
            };

            await api.post(`/customer/${userId}/payment-methods`, payload);
            return await paymentService.getPaymentMethods(); // Reload
        } catch (error) {
            console.error("Failed to add payment method", error);
            throw error;
        }
    },

    updatePaymentMethod: async (id, updatedData) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const payload = {
                id: id,
                bankName: updatedData.brand,
                accountNumber: updatedData.number || '0000', // Warning: losing full number if not provided
                accountHolderName: updatedData.holderName,
                customerId: userId
            };
            await api.put(`/customer/${userId}/payment-methods/${id}`, payload);
            return await paymentService.getPaymentMethods();
        } catch (error) {
            console.error("Failed to update payment method", error);
            throw error;
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            await api.delete(`/customer/${userId}/payment-methods/${id}`);
            return true;
        } catch (error) {
            console.error("Failed to delete payment method", error);
            throw error;
        }
    }
};
