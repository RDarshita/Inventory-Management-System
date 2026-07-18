import api from './axios';

const productService = {
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    searchProducts: async (keyword) => {
        const response = await api.get(`/products/search?keyword=${keyword}`);
        return response.data;
    },

    searchAndFilter: async ({ keyword = '', category = '', supplier = '', stockStatus = '', minPrice = null, maxPrice = null }) => {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (category) params.append('category', category);
        if (supplier) params.append('supplier', supplier);
        if (stockStatus) params.append('stockStatus', stockStatus);
        if (minPrice !== null) params.append('minPrice', minPrice);
        if (maxPrice !== null) params.append('maxPrice', maxPrice);
        const response = await api.get(`/products/search?${params.toString()}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/products/filters/categories');
        return response.data;
    },

    getSuppliers: async () => {
        const response = await api.get('/products/filters/suppliers');
        return response.data;
    }
};

export default productService;
