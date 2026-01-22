import api from './api';

const STORAGE_KEY = 'user_orders'; // Keep for fast fallback if needed, or remove? Remove for clean implementation.

export const orderService = {
    getOrders: async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const response = await api.get(`/order/orders/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to load orders", error);
            return [];
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await api.get(`/order/orders/details/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to load order ${id}`, error);
            throw error;
        }
    },

    requestCancellation: async (id) => {
        try {
            const response = await api.post(`/order/orders/${id}/cancel`);
            // Backend returns boolean, but we need updated order or confirmation.
            // We should re-fetch order details or return manual update.
            return await orderService.getOrderById(id);
        } catch (error) {
            throw error;
        }
    },

    checkout: async (customerId) => {
        const response = await api.post(`/order/orders/${customerId}/checkout`);
        return response.data;
    },

    // Admin
    getAllOrders: async () => {
        try {
            const response = await api.get('/order/orders/admin/all');
            return response.data;
        } catch (error) {
            // console.error("Failed to load admin orders", error); // optional logging
            throw error;
        }
    },

    processCancellation: async (orderId, approve) => {
        try {
            await api.post(`/order/orders/${orderId}/process-cancellation`, null, {
                params: { approve }
            });
        } catch (error) {
            throw error;
        }
    }
};
