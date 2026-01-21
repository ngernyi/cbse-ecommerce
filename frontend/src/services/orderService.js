// Mock order data
const STORAGE_KEY = 'user_orders';

const MOCK_ORDERS = [
    {
        id: 'ORD-1001',
        date: '2025-10-15T14:30:00Z',
        status: 'Delivered',
        total: 349.99,
        items: [
            { id: '2', name: 'Classic Leather Handbag', price: 350.00, quantity: 1, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&q=80' }
        ],
        shippingAddress: {
            fullName: 'Alex Johnson',
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
        }
    },
    {
        id: 'ORD-1002',
        date: '2026-01-20T09:15:00Z',
        status: 'Processing',
        total: 120.00,
        items: [
            { id: '1', name: 'Luxury Silk Scarf', price: 120.00, quantity: 1, image: 'https://images.unsplash.com/photo-1544133469-801fc7be78e8?w=100&q=80' }
        ],
        shippingAddress: {
            fullName: 'Alex Johnson',
            street: '123 Main St, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001'
        }
    }
];

export const orderService = {
    getOrders: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                resolve(stored ? JSON.parse(stored) : MOCK_ORDERS);
            }, 500);
        });
    },

    getOrderById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_ORDERS));
                const order = stored.find(o => o.id === id);
                if (order) resolve(order);
                else reject(new Error('Order not found'));
            }, 500);
        });
    },

    requestCancellation: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_ORDERS));
                const orderIndex = stored.findIndex(o => o.id === id);

                if (orderIndex === -1) {
                    reject(new Error('Order not found'));
                    return;
                }

                const order = stored[orderIndex];
                if (order.status !== 'Processing') {
                    reject(new Error('Order cannot be cancelled'));
                    return;
                }

                order.status = 'Cancelled';
                stored[orderIndex] = order;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
                resolve(order);
            }, 500);
        });
    }
};
