import axios from 'axios';

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. https://e-commerce-c1ct.onrender.com
    withCredentials: true,
});

// 🔐 Auth routes
export const loginUser = (data) => Api.post('/api/users/login', data);
export const registerUser = (data) => Api.post('/api/users/register', data);
export const promoteUser = (data, token) =>
    Api.put('/api/users/promote', data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// 🛍️ Product routes
export const getProducts = () => Api.get('/api/products');
export const getProductByName = (name) => Api.get(`/api/products/${name}`);
export const getProductById = (id) => Api.get(`/api/products/id/${id}`); // ✅ new helper

export const createProduct = (formData, token) =>
    Api.post('/api/products', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

export const updateProductByName = (formData, token) =>
    Api.put('/api/products', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });

export const deleteProductByName = (names, token) =>
    Api.delete('/api/products', {
        data: names,
        headers: { Authorization: `Bearer ${token}` },
    });

// 📦 Category routes
export const getCategories = () => Api.get('/api/categories');
export const getCategoryByName = (name) => Api.get(`/api/categories/${name}`);
export const createCategory = (data, token) =>
    Api.post('/api/categories', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const updateCategoryByName = (name, data, token) =>
    Api.put(`/api/categories/${name}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const deleteCategoryByName = (name, token) =>
    Api.delete(`/api/categories/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// 🧾 Order routes
export const createOrder = (data, token) =>
    Api.post('/api/orders', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const getMyOrders = (token) =>
    Api.get('/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
    });
export const getAllOrders = (token) =>
    Api.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
    });
export const updateOrderStatus = (data, token) =>
    Api.put('/api/orders/status', data, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const deleteOrder = (orderId, token) =>
    Api.delete(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
export const cancelOrder = (orderId, token) =>
    Api.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });


export default Api;
