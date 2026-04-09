import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export const productAPI = {
    getAll: () => api.get('/products'),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

export const activityAPI = {
    getAll: () => api.get('/activities'),
};

export default api;
