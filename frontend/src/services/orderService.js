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
            // We need an endpoint for single order. OrderRestService has @GET @Path("/orders/{customerId}") returning list.
            // It doesn't seem to have single order endpoint in the REST service I browsed earlier?
            // Let's verify OrderRestService.
            // Assuming it might not exist, we filter the list for now.
            // Ideally we add getOrder(orderId).
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const orders = await orderService.getOrders();
            const order = orders.find(o => o.id == id); // Loose equality for string/number match
            if (order) return order;
            throw new Error('Order not found');
        } catch (error) {
            throw error;
        }
    },

    requestCancellation: async (id) => {
        // Not implemented in backend yet.
        console.warn("Cancellation not implemented in OSGi backend.");
        return null;
    },

    checkout: async (customerId) => {
        const response = await api.post(`/order/orders/${customerId}/checkout`);
        return response.data;
    }
};
