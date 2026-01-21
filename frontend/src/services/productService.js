import api from './api';

export const productService = {
    getAllProducts: async (filters = {}) => {
        try {
            let url = '/products';
            const params = {};

            // Handle sorting
            if (filters.sort) {
                if (filters.sort === 'price_asc') {
                    params.sortBy = 'price';
                    params.direction = 'ASC';
                } else if (filters.sort === 'price_desc') {
                    params.sortBy = 'price';
                    params.direction = 'DESC';
                } else if (filters.sort === 'rating') {
                    params.sortBy = 'rating';
                    params.direction = 'DESC';
                }
            }

            // Handle search
            if (filters.search) {
                url = '/products/search';
                params.keyword = filters.search;
            }
            // Handle category
            else if (filters.category) {
                // Assuming filters.category is the ID. If it's a name, we might need a different approach or backend change.
                // For now, let's try to use the category endpoint if we have an ID.
                // If the frontend passes a name, this will fail unless we map it.
                // However, standard practice is to use IDs. 
                // If the UI passes a name, we might need to fetch all categories to find the ID, but that's inefficient.
                // Let's assume we can pass the ID.
                url = `/products/category/${filters.category}`;
            }

            const response = await api.get(url, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data; // Returns List<Category> objects {id, name, ...}
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getRecommendations: async (customerId) => {
        try {
            if (!customerId) return [];
            const response = await api.get(`/recommendations/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
    }
};

