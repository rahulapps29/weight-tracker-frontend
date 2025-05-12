import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.trackwellness.in/api/auth",
});

export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;
