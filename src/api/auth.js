import api from "./axios";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh", {
    refreshToken,
  });

  return response.data;
};
