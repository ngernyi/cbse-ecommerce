// Mock product data
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Luxury Silk Scarf',
        category: 'Accessories',
        price: 120.00,
        rating: 4.8,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1544133469-801fc7be78e8?w=500&q=80',
        description: 'Handcrafted from 100% pure silk, this scarf adds a touch of elegance to any outfit.'
    },
    {
        id: '2',
        name: 'Classic Leather Handbag',
        category: 'Bags',
        price: 350.00,
        rating: 4.9,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80',
        description: 'Timeless design meets modern functionality in this premium leather handbag.'
    },
    {
        id: '3',
        name: 'Minimalist Watch',
        category: 'Watches',
        price: 199.00,
        rating: 4.5,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80',
        description: 'A sleek, minimalist watch suitable for both casual and formal occasions.'
    },
    {
        id: '4',
        name: 'Designer Sunglasses',
        category: 'Accessories',
        price: 150.00,
        rating: 4.7,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
        description: 'Protect your eyes in style with these high-quality designer sunglasses.'
    },
    {
        id: '5',
        name: 'Leather Boots',
        category: 'Footwear',
        price: 220.00,
        rating: 4.6,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=500&q=80',
        description: 'Durable and stylish leather boots, perfect for any season.'
    },
    {
        id: '6',
        name: 'Gold Plated Necklace',
        category: 'Jewelry',
        price: 85.00,
        rating: 4.4,
        reviews: 130,
        image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500&q=80',
        description: 'A delicate gold-plated necklace that adds a subtle shine to your look.'
    }
];

export const productService = {
    getAllProducts: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let result = [...MOCK_PRODUCTS];

                // Filter by category
                if (filters.category) {
                    result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
                }

                // Search by keyword
                if (filters.search) {
                    const query = filters.search.toLowerCase();
                    result = result.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
                }

                // Sort
                if (filters.sort) {
                    if (filters.sort === 'price_asc') {
                        result.sort((a, b) => a.price - b.price);
                    } else if (filters.sort === 'price_desc') {
                        result.sort((a, b) => b.price - a.price);
                    } else if (filters.sort === 'rating') {
                        result.sort((a, b) => b.rating - a.rating);
                    }
                }

                resolve(result);
            }, 500);
        });
    },

    getProductById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const product = MOCK_PRODUCTS.find(p => p.id === id);
                if (product) resolve(product);
                else reject(new Error('Product not found'));
            }, 500);
        });
    },

    getCategories: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
                resolve(categories);
            }, 300);
        });
    },

    getRecommendations: async () => {
        // Return fixed recommendations for now
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_PRODUCTS.slice(0, 3));
            }, 300);
        });
    }
};
