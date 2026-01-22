import api from './api';
import { authService } from './authService';

export const paymentService = {
    getPaymentMethods: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');
            const response = await api.get(`/payment-methods/customer/${user.id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    },

    addPaymentMethod: async (method) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');
            const response = await api.post(`/payment-methods/customer/${user.id}`, method);
            return response.data;
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    },

    updatePaymentMethod: async (id, updatedData) => {
        try {
            const response = await api.put(`/payment-methods/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating payment method:', error);
            throw error;
        }
    },

    deletePaymentMethod: async (id) => {
        try {
            await api.delete(`/payment-methods/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting payment method:', error);
            throw error;
        }
    }
};
