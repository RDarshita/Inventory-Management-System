import api from './axios';

const itemService = {
    getItemsByParty: async (partyId) => {
        const response = await api.get(`/items/party/${partyId}`);
        return response.data;
    },

    getItemById: async (id) => {
        const response = await api.get(`/items/${id}`);
        return response.data;
    },

    createItem: async (partyId, itemData) => {
        const response = await api.post(`/items/party/${partyId}`, itemData);
        return response.data;
    },

    updateItem: async (id, itemData) => {
        const response = await api.put(`/items/${id}`, itemData);
        return response.data;
    },

    deleteItem: async (id) => {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    }
};

export default itemService;
