import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Spring Boot default port
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;
