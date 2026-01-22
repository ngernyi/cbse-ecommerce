import api from './api';
import { authService } from './authService';

export const wishlistService = {
    getWishlist: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) return [];

            // Get all wishlists for customer
            const response = await api.get(`/wishlists/customer/${user.id}`);
            let wishlists = response.data;

            // If no wishlist exists, create a default one
            if (wishlists.length === 0) {
                const createResponse = await api.post(`/wishlists/customer/${user.id}`, { name: 'My Wishlist' });
                wishlists = [createResponse.data];
            }

            // For now, we just use the first wishlist
            const defaultWishlist = wishlists[0];

            // Map products to frontend structure
            return defaultWishlist.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                image: (product.images && product.images.length > 0)
                    ? `${api.defaults.baseURL}${product.images[0].imageUrl}`
                    : 'https://via.placeholder.com/150',
                inStock: product.stockQuantity > 0
            }));
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            return [];
        }
    },

    addToWishlist: async (product) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            // Get or create wishlist
            let response = await api.get(`/wishlists/customer/${user.id}`);
            let wishlists = response.data;
            let wishlistId;

            if (wishlists.length === 0) {
                const createResponse = await api.post(`/wishlists/customer/${user.id}`, { name: 'My Wishlist' });
                wishlistId = createResponse.data.id;
            } else {
                wishlistId = wishlists[0].id;
            }

            // Add product to wishlist
            await api.post(`/wishlists/${wishlistId}/product/${product.id}`);

            // Return updated wishlist
            return await wishlistService.getWishlist();
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            const response = await api.get(`/wishlists/customer/${user.id}`);
            if (response.data.length === 0) return [];

            const wishlistId = response.data[0].id;

            await api.delete(`/wishlists/${wishlistId}/product/${productId}`);

            return await wishlistService.getWishlist();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            throw error;
        }
    }
};
