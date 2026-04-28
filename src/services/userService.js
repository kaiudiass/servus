import api from './api';

export const userService = {
    getUsers: async () => {
        return api.get('/users');
    },

    getUser: async (id) => {
        return api.get(`/users/${id}`);
    },

    updateUser: async (id, userData) => {
        return api.patch(`/users/${id}`, userData);
    },

    deleteUser: async (id) => {
        return api.delete(`/users/${id}`);
    }
};