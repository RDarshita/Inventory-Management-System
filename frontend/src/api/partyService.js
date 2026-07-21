import api from './axios';

const partyService = {
    getAllParties: async () => {
        const response = await api.get('/parties');
        return response.data;
    },

    getPartyById: async (id) => {
        const response = await api.get(`/parties/${id}`);
        return response.data;
    },

    createParty: async (partyData) => {
        const response = await api.post('/parties', partyData);
        return response.data;
    },

    updateParty: async (id, partyData) => {
        const response = await api.put(`/parties/${id}`, partyData);
        return response.data;
    },

    deleteParty: async (id) => {
        const response = await api.delete(`/parties/${id}`);
        return response.data;
    },

    getPartySummary: async (id) => {
        const response = await api.get(`/parties/${id}/summary`);
        return response.data;
    },

    getOutstandingInvoices: async (id) => {
        const response = await api.get(`/parties/${id}/outstanding-invoices`);
        return response.data;
    },

    getPartyLedger: async (id) => {
        const response = await api.get(`/parties/${id}/ledger`);
        return response.data;
    },

    createTransaction: async (partyId, transactionData) => {
        const response = await api.post(`/parties/${partyId}/transactions`, transactionData);
        return response.data;
    },

    downloadLedgerPdf: async (id) => {
        const response = await api.get(`/parties/${id}/ledger/pdf`, { responseType: 'blob' });
        return response.data;
    }
};

export default partyService;
