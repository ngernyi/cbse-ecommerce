// Mock cart persistence
const STORAGE_KEY = 'user_cart';

export const cartService = {
    getCart: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                resolve(stored ? JSON.parse(stored) : { items: [], coupon: null });
            }, 500);
        });
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

    saveCart: async (items, coupon) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = { items, coupon };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                resolve(data);
            }, 300);
        });
    },

    validateCoupon: async (code) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock coupons
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
