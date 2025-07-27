const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api'  // In production, same domain
    : 'http://localhost:4000/api';  // In development, local backend

export default API_BASE_URL;
