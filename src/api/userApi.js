import axiosClient from "./axiosClient";

const userApi = {
  getInfo: async () => {
    const url = `/auth/profile`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      console.error("Error getting user by token:", error.message);
      throw error;
    }
  },

  getAllUserByPageAndLimit: async (page, limit) => {
    const url = `/users?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addCoordinates: async (newData) => {
    const url = `/users/add-coordinates`;
    try {
      const response = await axiosClient.post(url, newData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAllRescueNeeded: async () => {
    const url = `/users/rescue-needed`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // New
  getAllRescueSeeker: async () => {
    const url = `/users/rescue-seeker`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAllRescueHistory: async () => {
    const url = `/users/rescue-history`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userApi;
