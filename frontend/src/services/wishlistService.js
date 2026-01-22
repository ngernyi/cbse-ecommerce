import api from './api';

export const wishlistService = {
    getWishlist: async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const response = await api.get(`/customer/${userId}/wishlist`);
            // Backend returns Wishlist object with 'products' list
            return response.data?.products || [];
        } catch (error) {
            console.error("Failed to load wishlist", error);
            return [];
        }
    },

    addToWishlist: async (product) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // Endpoint: POST /customer/{customerId}/wishlist/{productId}
            await api.post(`/customer/${userId}/wishlist/${product.id}`);
            return await wishlistService.getWishlist();
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // Endpoint: DELETE /customer/{customerId}/wishlist/{productId}
            await api.delete(`/customer/${userId}/wishlist/${productId}`);
            return await wishlistService.getWishlist();
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            throw error;
        }
    }
};
