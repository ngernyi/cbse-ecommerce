import api from './api';
import { authService } from './authService';

export const addressService = {
    getAddresses: async () => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');
            const response = await api.get(`/addresses/customer/${user.id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching addresses:', error);
            throw error;
        }
    },

    addAddress: async (address) => {
        try {
            const user = authService.getCurrentUser();
            if (!user) throw new Error('User not authenticated');
            const response = await api.post(`/addresses/customer/${user.id}`, address);
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            throw error;
        }
    },

    updateAddress: async (id, updatedData) => {
        try {
            const response = await api.put(`/addresses/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating address:', error);
            throw error;
        }
    },

    deleteAddress: async (id) => {
        try {
            await api.delete(`/addresses/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting address:', error);
            throw error;
        }
    }
};
