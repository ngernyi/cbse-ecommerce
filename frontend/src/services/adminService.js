// Mock admin data
import { productService } from './productService';
import { orderService } from './orderService';

export const adminService = {
    getDashboardStats: async () => {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const products = await productService.getAllProducts();
                const orders = await orderService.getOrders();

                const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
                const totalOrders = orders.length;
                const totalProducts = products.length;
                const recentOrders = orders.slice(0, 5);

                resolve({
                    totalSales,
                    totalOrders,
                    totalProducts,
                    recentOrders
                });
            }, 500);
        });
    },

    deleteProduct: async (id) => {
        // In a real app, this would call API
        console.log(`Deleting product ${id}`);
        return new Promise(resolve => setTimeout(resolve, 300));
    },

    saveProduct: async (product) => {
        console.log('Saving product', product);
        return new Promise(resolve => setTimeout(() => resolve(product), 300));
    }
};
