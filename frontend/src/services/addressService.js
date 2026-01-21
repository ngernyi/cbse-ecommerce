// Mock address data stored in localStorage
const STORAGE_KEY = 'user_addresses';

const MOCK_ADDRESSES = [
    {
        id: '1',
        label: 'Home',
        fullName: 'Alex Johnson',
        street: '123 Main St, Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        isDefault: true
    }
];

export const addressService = {
    getAddresses: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = localStorage.getItem(STORAGE_KEY);
                resolve(stored ? JSON.parse(stored) : MOCK_ADDRESSES);
            }, 500);
        });
    },

    addAddress: async (address) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_ADDRESSES));
                const newAddress = { ...address, id: Date.now().toString() };

                // If it's the first address or marked default, handle defaults
                if (newAddress.isDefault || stored.length === 0) {
                    stored.forEach(a => a.isDefault = false);
                    newAddress.isDefault = true;
                }

                const updated = [...stored, newAddress];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                resolve(newAddress);
            }, 500);
        });
    },

    updateAddress: async (id, updatedData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_ADDRESSES));
                let updatedAddresses = stored.map(addr => {
                    if (addr.id === id) {
                        return { ...addr, ...updatedData };
                    }
                    return addr;
                });

                // Handle default switch
                if (updatedData.isDefault) {
                    updatedAddresses = updatedAddresses.map(addr => {
                        if (addr.id !== id) addr.isDefault = false;
                        return addr;
                    });
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
                resolve(updatedAddresses.find(a => a.id === id));
            }, 500);
        });
    },

    deleteAddress: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(MOCK_ADDRESSES));
                const filtered = stored.filter(addr => addr.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                resolve(true);
            }, 500);
        });
    }
};
