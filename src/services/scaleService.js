import api from './api';

export const scaleService = {
    getScales: async () => {
        return api.get('/scales');
    },

    getUpcomingScales: async (onlyMine = false) => {
        return api.get('/scales/upcoming', { params: { onlyMine } });
    },

    getHistoryScales: async (onlyMine = false) => {
        return api.get('/scales/history', { params: { onlyMine } });
    },

    createScale: async (scaleData) => {
        return api.post('/scales', scaleData);
    },

    updateScale: async (id, scaleData) => {
        return api.put(`/scales/${id}`, scaleData);
    },

    deleteScale: async (id) => {
        return api.delete(`/scales/${id}`);
    },

    copyScale: async (sourceId, data) => {
        return api.post(`/scales/${sourceId}/copy`, data);
    },

    updateScaleSector: async (scaleId, sectorId, names) => {
        return api.post(`/scales/${scaleId}/sectors`, { sectorId, names });
    },

    deleteScaleUser: async (scaleId, userId) => {
        return api.delete(`/scales/${scaleId}/users/${userId}`);
    }
};