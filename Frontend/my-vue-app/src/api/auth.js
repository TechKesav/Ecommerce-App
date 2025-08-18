import axios from "axios";

const API_URL = "http://localhost:8080"; 

export const login = (user) => {
  return axios.post(`${API_URL}/login`, user, {
    headers: { "Content-Type": "application/json" },
  });
};
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (user) => {
  return axios.post(`${API_URL}/register`, user, {
    headers: { "Content-Type": "application/json" },
  });
};
