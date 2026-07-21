import api from './axios';

const incomingService = {
    getAllPayments: async () => {
        const response = await api.get('/incoming');
        return response.data;
    },
    
    getStats: async () => {
        const response = await api.get('/incoming/stats');
        return response.data;
    },

    createPayment: async (paymentData) => {
        const response = await api.post('/incoming', paymentData);
        return response.data;
    },

    updatePayment: async (id, paymentData) => {
        const response = await api.put(`/incoming/${id}`, paymentData);
        return response.data;
    },

    deletePayment: async (id) => {
        const response = await api.delete(`/incoming/${id}`);
        return response.data;
    }
};

export default incomingService;
