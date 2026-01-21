// Mock payment methods data
const STORAGE_KEY = 'user_payment_methods';

const MOCK_PAYMENT_METHODS = [
    {
        id: '1',
        type: 'Credit Card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: '12',
        expiryYear: '2028',
        holderName: 'Alex Johnson',
        isDefault: true
    }
];

export const paymentService = {
    getPaymentMethods: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                resolve(stored ? JSON.parse(stored) : MOCK_PAYMENT_METHODS);
            }, 500);
        });
    },

    addPaymentMethod: async (method) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_PAYMENT_METHODS));
                const newMethod = { ...method, id: Date.now().toString() };

                if (newMethod.isDefault || stored.length === 0) {
                    stored.forEach(m => m.isDefault = false);
                    newMethod.isDefault = true;
                }

                const updated = [...stored, newMethod];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                resolve(newMethod);
            }, 500);
        });
    },

    updatePaymentMethod: async (id, updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_PAYMENT_METHODS));
                let updatedMethods = stored.map(method => {
                    if (method.id === id) {
                        return { ...method, ...updatedData };
                    }
                    return method;
                });

                if (updatedData.isDefault) {
                    updatedMethods = updatedMethods.map(method => {
                        if (method.id !== id) method.isDefault = false;
                        return method;
                    });
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMethods));
                resolve(updatedMethods.find(m => m.id === id));
            }, 500);
        });
    },

    deletePaymentMethod: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_PAYMENT_METHODS));
                const filtered = stored.filter(m => m.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                resolve(true);
            }, 500);
        });
    }
};
