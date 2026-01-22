import api from './api';

export const authService = {
    // Login
    login: async (email, password) => {
        try {
            const response = await api.post('/customers/login', { email, password });
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Register
    register: async (data) => {
        try {
            const response = await api.post('/customers', data);
            const user = response.data;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Update profile
    updateProfile: async (data) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            if (!currentUser || !currentUser.id) throw new Error('No user logged in');

            const response = await api.put(`/customers/${currentUser.id}`, data);
            const updatedUser = response.data;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        } catch (error) {
            console.error('Update profile failed:', error);
            throw error;
        }
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
    }
};
