export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to build full endpoint paths
export const apiUrl = (path = "") => `${API_BASE_URL}${path}`;
