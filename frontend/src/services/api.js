const axios = require('axios');

const token = localStorage.getItem("authToken");

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    },
});

export default api;
