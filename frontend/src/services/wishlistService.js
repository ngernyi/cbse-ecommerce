// Mock wishlist data
const STORAGE_KEY = 'user_wishlist';

const MOCK_WISHLIST = [
    {
        id: '101',
        name: 'Luxury Silk Scarf',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1544133469-801fc7be78e8?w=500&q=80',
        inStock: true
    },
    {
        id: '102',
        name: 'Classic Leather Handbag',
        price: 350.00,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
        inStock: true
    }
];

export const wishlistService = {
    getWishlist: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                resolve(stored ? JSON.parse(stored) : MOCK_WISHLIST);
            }, 500);
        });
    },

    addToWishlist: async (product) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_WISHLIST));
                if (!stored.find(item => item.id === product.id)) {
                    const updated = [...stored, product];
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                    resolve(updated);
                } else {
                    resolve(stored);
                }
            }, 300);
        });
    },

    removeFromWishlist: async (productId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_WISHLIST));
                const updated = stored.filter(item => item.id !== productId);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                resolve(updated);
            }, 300);
        });
    }
};
