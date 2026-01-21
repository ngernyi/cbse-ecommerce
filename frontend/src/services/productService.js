import api from './api';

export const productService = {
    getAllProducts: async (filters = {}) => {
        try {
            let url = '/catalog/products';
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
                // OSGi Catalog: /catalog/products?search=...
                // The backend implementation handles 'search' query param on base /products endpoint or separate one.
                // Looking at CatalogRestService: @Path("/products") check query param "search".
                // So url is still /catalog/products.
                // Wait, previous code used /products/search.
                // Let's assume OSGi implementation uses query param.
                url = '/catalog/products';
                params.search = filters.search; // Mapped 'keyword' to 'search' to match OSGi
            }
            // Handle category
            else if (filters.category) {
                url = `/catalog/products/category/${filters.category}`;
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
            const response = await api.get(`/catalog/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    getCategories: async () => {
        try {
            const response = await api.get('/catalog/categories');
            return response.data; // Returns List<Category> objects {id, name, ...}
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getRecommendations: async (customerId) => {
        try {
            if (!customerId) return [];
            const response = await api.get(`/catalog/recommendations/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return [];
        }
    }
};

