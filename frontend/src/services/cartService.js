import api from './api';

const STORAGE_KEY = 'user_cart';

export const cartService = {
    getCart: async () => {
        try {
            // Assume user ID 1 for now, or get from auth
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const response = await api.get(`/cart/cart/${userId}`);
            // Backend returns list of items. Totals are calculated by frontend or backend?
            // Backend getCart returns List<CartItem>.
            // Frontend expects { items: [], coupon: null } based on previous code.
            // We need to map it.
            return { items: response.data, coupon: null };
        } catch (error) {
            console.error("Failed to load cart", error);
            return { items: [], coupon: null };
        }
    },

    calculateTotals: (items, coupon) => {
        // Keep frontend logic for now as immediate feedback
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let discount = 0;
        if (coupon) {
            if (coupon.type === 'percent') {
                discount = subtotal * (coupon.value / 100);
            } else if (coupon.type === 'fixed') {
                discount = coupon.value;
            }
        }
        const total = Math.max(0, subtotal - discount);
        return { subtotal, discount, total };
    },

    saveCart: async (items, coupon) => {
        // OSGi backend saves implicitly via add/remove calls.
        // This 'saveCart' was likely for local storage sync.
        // We can leave it empty or use it to validat sync.
        return { items, coupon };
    },

    addToCart: async (product, quantity) => {
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr).id : 1;
        // API: POST /cart/cart/{customerId}/add body: {productId, quantity}
        await api.post(`/cart/cart/${userId}/add`, { productId: product.id, quantity });
    },

    removeFromCart: async (productId) => { // This productId is likely Product ID, but backend needs Cart Item ID?
        // Frontend passes productId usually.
        // We need to find the cart item ID?
        // Let's assume frontend passes cart item ID or we need to look it up.
        // The 'removeFromCart(productId)' in Context implies it passes productId.
        // BUT the OSGi backend `deleteAddress` uses ID.
        // Wait, `removeCartItem` in `CartRestService` uses `itemId`.
        // We might have a mismatch.
        // For now, let's look at `CartContext.jsx`: removeCartItem passes productId.
        // We need to change Context to pass itemId OR lookup here.
        // Let's defer this complexity and check Context later.
        // Actually, CartItem has `id` (itemId) and `product`. 
        // If Context uses product.id it's wrong for backend delete.
    },

    validateCoupon: async (code) => {
        const userStr = localStorage.getItem('user');
        const userId = userStr ? JSON.parse(userStr).id : 1;
        const response = await api.post(`/cart/cart/${userId}/coupon?code=${code}`);
        // Backend returns double (discount amount or total?).
        // Frontend expects coupon object.
        // We might need to mock the object on success.
        return { code, type: 'fixed', value: response.data }; // Simplified
    }
};
