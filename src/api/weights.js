import axios from "axios";

const api = axios.create({
  baseURL: "https://backend.trackwellness.in/api/weights",
});

const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const addWeightEntry = async (entryData, token) => {
  setAuthHeader(token);
  const response = await api.post("/", entryData);
  return response.data;
};

export const getWeightEntries = async (token) => {
  setAuthHeader(token);
  const response = await api.get("/");
  return response.data;
};

export const updateWeightEntry = async (id, entryData, token) => {
  setAuthHeader(token);
  const response = await api.put(`/${id}`, entryData);
  return response.data;
};

export const deleteWeightEntry = async (id, token) => {
  setAuthHeader(token);
  const response = await api.delete(`/${id}`);
  return response.data;
};
