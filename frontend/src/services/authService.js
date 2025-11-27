const axios = require('axios');

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export async function loginUser(username, password) {
    try
    {
    const response = await api.post('/login', { username, password });

    const token = response.data.token;
    return response.data;
    }
    catch (error)
    { 
        console.log("Login Failed");
    }
}
