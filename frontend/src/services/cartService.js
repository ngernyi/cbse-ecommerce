import api from './api';
import { authService } from './authService';

export const cartService = {
    getCart: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return { items: [], coupon: null };

            const response = await api.get(`/cart/customer/${user.id}`);
            const cartItems = response.data;

            // Map backend CartItem to frontend structure
            const items = cartItems.map(item => ({
                id: item.id, // CartItem ID
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: (item.product.images && item.product.images.length > 0)
                    ? `${api.defaults.baseURL}${item.product.images[0].imageUrl}`
                    : 'https://via.placeholder.com/150',
                quantity: item.quantity,
                maxStock: item.product.stockQuantity
            }));

            return { items, coupon: null };
        } catch (error) {
            console.error('Error fetching cart:', error);
            return { items: [], coupon: null };
        }
    },

    addToCart: async (product, quantity = 1) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            await api.post(`/cart/customer/${user.id}/add`, {
                productId: product.id,
                quantity: quantity
            });

            // Return updated cart
            return await cartService.getCart();
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        try {
            await api.put(`/cart/item/${cartItemId}`, { quantity });
            return await cartService.getCart();
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            throw error;
        }
    },

    removeFromCart: async (cartItemId) => {
        try {
            await api.delete(`/cart/item/${cartItemId}`);
            return await cartService.getCart();
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    },

    clearCart: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return;
            await api.delete(`/cart/customer/${user.id}`);
            return { items: [], coupon: null };
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },

    calculateTotals: (items, coupon) => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;

        if (coupon) {
            if (coupon.type === 'percent') {
                discount = subtotal * (coupon.value / 100);
            } else if (coupon.type === 'fixed') {
                discount = coupon.value;
            }
        }

        // Ensure no negative total
        const total = Math.max(0, subtotal - discount);
        return { subtotal, discount, total };
    },

    validateCoupon: async (code) => {
        // Keep mock coupon logic for now as backend doesn't seem to have coupon endpoints yet
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const coupons = {
                    'WELCOME10': { type: 'percent', value: 10, code: 'WELCOME10' },
                    'SAVE20': { type: 'fixed', value: 20, code: 'SAVE20' }
                };

                if (coupons[code]) resolve(coupons[code]);
                else reject(new Error('Invalid coupon code'));
            }, 500);
        });
    }
};
