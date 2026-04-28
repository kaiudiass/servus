import api from './api';

export const noticeService = {
    getAllNotices: async () => {
        return api.get('/notices');
    },

    getActiveNotices: async () => {
        return api.get('/notices/active');
    },

    getUserNotices: async () => {
        return api.get('/notices/user');
    },

    createNotice: async (noticeData) => {
        return api.post('/notices', noticeData);
    },

    updateNotice: async (id, noticeData) => {
        return api.put(`/notices/${id}`, noticeData);
    },

    deleteNotice: async (id) => {
        return api.delete(`/notices/${id}`);
    }
};