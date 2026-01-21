// Mock user data
const MOCK_USER = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=0F172A&color=fff'
};

export const authService = {
    // Simulate login
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // For demo/mock purposes, accept specific credentials or just any non-empty ones
                if (email && password) {
                    // simpler check for demo
                    localStorage.setItem('user', JSON.stringify(MOCK_USER));
                    resolve(MOCK_USER);
                } else {
                    reject(new Error('Invalid credentials'));
                }
            }, 500);
        });
    },

    // Simulate register
    register: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = { ...MOCK_USER, ...data };
                localStorage.setItem('user', JSON.stringify(newUser));
                resolve(newUser);
            }, 500);
        });
    },

    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Update profile
    updateProfile: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const currentUser = JSON.parse(localStorage.getItem('user') || JSON.stringify(MOCK_USER));
                const updatedUser = { ...currentUser, ...data };
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist mock update
                resolve(updatedUser);
            }, 500);
        });
    },

    // Logout
    logout: () => {
        localStorage.removeItem('user');
    }
};
