import api from './axios';

const purchaseService = {
    getAllPurchases: async () => {
        const response = await api.get('/purchases');
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/purchases/stats');
        return response.data;
    },

    getItemReport: async () => {
        const response = await api.get('/purchases/item-report');
        return response.data;
    },

    createPurchase: async (purchaseData) => {
        const response = await api.post('/purchases', purchaseData);
        return response.data;
    },

    updatePurchase: async (id, purchaseData) => {
        const response = await api.put(`/purchases/${id}`, purchaseData);
        return response.data;
    },

    deletePurchase: async (id) => {
        const response = await api.delete(`/purchases/${id}`);
        return response.data;
    }
};

export default purchaseService;
