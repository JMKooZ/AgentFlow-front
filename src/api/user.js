import api from "./axios";

export const getMyProfile = async () => {
  const response = await api.get("/users/me");

  return response.data;
};
