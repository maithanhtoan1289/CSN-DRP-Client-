import axiosClient from "./axiosClient";

const authApi = {
  loginUser: async (data) => {
    const url = "/auth/login";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  registerUser: async (data) => {
    const url = "/auth/register";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  logoutUser: async () => {
    const url = "/auth/logout";
    try {
      const response = await axiosClient.post(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
