import api from './api';
import { productService } from './productService';
import { orderService } from './orderService';

export const adminService = {
    getDashboardStats: async () => {
        // Mock dashboard stats for now by fetching all data
        const products = await productService.getAllProducts();
        // const orders = await orderService.getOrders(); // Order service needs user ID, admin usually sees all.
        // Backend 'all orders' endpoint missing?
        const orders = [];

        const totalSales = 0;
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const recentOrders = [];

        return {
            totalSales,
            totalOrders,
            totalProducts,
            recentOrders
        };
    },

    deleteProduct: async (id) => {
        await api.delete(`/admin/admin/products/${id}`);
    },

    saveProduct: async (product) => {
        if (product.id) {
            await api.put(`/admin/admin/products/${product.id}`, product);
            return product;
        } else {
            const response = await api.post('/admin/admin/products', product);
            return response.data;
        }
    }
};
