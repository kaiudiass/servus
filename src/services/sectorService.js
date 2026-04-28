import api from './api';

export const sectorService = {
    getSectors: async () => {
        return api.get('/sectors');
    },

    createSector: async (sectorData) => {
        return api.post('/sectors', sectorData);
    },

    updateSector: async (id, sectorData) => {
        return api.put(`/sectors/${id}`, sectorData);
    },

    deleteSector: async (id) => {
        return api.delete(`/sectors/${id}`);
    },

    updateMembers: async (id, userIds) => {
        return api.put(`/sectors/${id}/members`, { userIds });
    }
};