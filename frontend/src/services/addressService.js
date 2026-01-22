import api from './api';

export const addressService = {
    getAddresses: async () => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            const response = await api.get(`/customer/${userId}/addresses`);
            return response.data;
        } catch (error) {
            console.error("Failed to load addresses", error);
            return [];
        }
    },

    addAddress: async (address) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // The backend Address object expects street, city, state, zipCode, country, customerId
            await api.post(`/customer/${userId}/addresses`, address);
            // Reload list to get the new ID, or return input if void.
            // Backend returns void, so we fetch list or return best effort.
            return address;
        } catch (error) {
            console.error("Failed to add address", error);
            throw error;
        }
    },

    updateAddress: async (id, updatedData) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // Endpoint: PUT /customer/{customerId}/addresses/{addressId}
            await api.put(`/customer/${userId}/addresses/${id}`, updatedData);
            return updatedData;
        } catch (error) {
            console.error("Failed to update address", error);
            throw error;
        }
    },

    deleteAddress: async (id) => {
        try {
            const userStr = localStorage.getItem('user');
            const userId = userStr ? JSON.parse(userStr).id : 1;
            // Endpoint: DELETE /customer/{customerId}/addresses/{addressId}
            await api.delete(`/customer/${userId}/addresses/${id}`);
            return true;
        } catch (error) {
            console.error("Failed to delete address", error);
            throw error;
        }
    }
};
