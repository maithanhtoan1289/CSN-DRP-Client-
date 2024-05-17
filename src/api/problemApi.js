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

  // Task 5
  addProblemVersion3: async (data) => {
    const url = "/problems/v3/add";
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

  // Task 1
  editProblemPriority: async (data) => {
    const url = "/problems/edit-priority";
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default problemApi;
