import api from './api';
import { authService } from './authService';

export const orderService = {
    getOrders: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            // Fetch OrderItems from backend
            const response = await api.get(`/orders/customer/${user.id}`);
            const orderItems = response.data;

            // Map OrderItems to the "Order" structure expected by UI
            // Since backend only has OrderItems, we treat each item as a separate "Order" for now
            return orderItems.map(item => ({
                id: item.id.toString(), // Use item ID as order ID
                date: item.orderDate,
                status: item.status, // e.g., PENDING, APPROVED, CANCELLED
                total: item.product.price * item.quantity,
                items: [
                    {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: (item.product.images && item.product.images.length > 0)
                            ? `${api.defaults.baseURL}${item.product.images[0].imageUrl}`
                            : 'https://via.placeholder.com/150'
                    }
                ],
                shippingAddress: item.address ? {
                    fullName: item.address.fullName || user.name,
                    street: item.address.street,
                    city: item.address.city,
                    state: item.address.state,
                    zipCode: item.address.zipCode
                } : {
                    fullName: user.name,
                    street: 'N/A',
                    city: 'N/A',
                    state: 'N/A',
                    zipCode: 'N/A'
                }
            }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await api.get(`/orders/${id}`);
            const item = response.data;
            const user = authService.getCurrentUser();

            // Map single OrderItem to Order structure
            return {
                id: item.id.toString(),
                date: item.orderDate,
                status: item.status,
                total: item.product.price * item.quantity,
                items: [
                    {
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: (item.product.images && item.product.images.length > 0)
                            ? `${api.defaults.baseURL}${item.product.images[0].imageUrl}`
                            : 'https://via.placeholder.com/150'
                    }
                ],
                shippingAddress: item.address ? {
                    fullName: item.address.fullName || (user ? user.name : 'Guest'),
                    street: item.address.street,
                    city: item.address.city,
                    state: item.address.state,
                    zipCode: item.address.zipCode
                } : {
                    fullName: user ? user.name : 'Guest',
                    street: 'N/A',
                    city: 'N/A',
                    state: 'N/A',
                    zipCode: 'N/A'
                }
            };
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    requestCancellation: async (id) => {
        try {
            const response = await api.post(`/orders/${id}/cancel-request`);
            return response.data;
        } catch (error) {
            console.error('Error requesting cancellation:', error);
            throw error;
        }
    },

    checkout: async (items) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            // Create an order item for each cart item
            const orderPromises = items.map(item =>
                api.post(`/orders/customer/${user.id}`, {
                    productId: item.productId,
                    quantity: item.quantity
                })
            );

            await Promise.all(orderPromises);
            return true;
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    }
};
