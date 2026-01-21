import axios from 'axios';

// Create an instance of axios with default configuration
const api = axios.create({
    baseURL: 'http://localhost:63695', // Access Spring Boot backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Assuming you store token here
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common errors (e.g. 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access (e.g. redirect to login)
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
