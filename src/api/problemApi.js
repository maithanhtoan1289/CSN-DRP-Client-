import axiosClient from "./axiosClient";

const problemApi = {
  getAllProblemByPageAndLimit: async (page, limit) => {
    const url = `/problems?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addProblemVersion1: async (data) => {
    const url = "/problems/v1/add";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addProblemVersion2: async (data) => {
    const url = "/problems/v2/add";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addProblemStatus: async (data) => {
    const url = "/problems/add-status";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default problemApi;
