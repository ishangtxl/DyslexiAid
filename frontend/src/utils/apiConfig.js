// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const getApiUrl = (endpoint) => {
    // Remove leading slash from endpoint if present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

    // In production on Vercel, API_BASE_URL will be empty and we use relative URLs
    // In development, it will be http://localhost:5001
    return API_BASE_URL ? `${API_BASE_URL}/${cleanEndpoint}` : `/${cleanEndpoint}`;
};

export default API_BASE_URL;
