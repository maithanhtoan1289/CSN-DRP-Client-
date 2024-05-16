import axiosClient from "./axiosClient";

const naturalDisasterApi = {
  getAllNaturalDisasterByPageAndLimit: async (page, limit) => {
    const url = `/natural-disasters?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addNaturalDisasterVersion1: async (data) => {
    const url = "/natural-disasters/v1/add";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  addNaturalDisasterVersion2: async (data) => {
    const url = "/natural-disasters/v2/add";
    try {
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

    // Task 5
    addNaturalDisasterVersion3: async (data) => {
      const url = "/natural-disasters/v3/add";
      try {
        const response = await axiosClient.post(url, data);
        return response;
      } catch (error) {
        throw error;
      }
    },

  addNaturalDisasterStatus: async (data) => {
    const url = "/natural-disasters/add-status";
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Task 1
  editNaturalDisasterPriority: async (data) => {
    const url = "/natural-disasters/edit-priority";
    try {
      const response = await axiosClient.put(url, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default naturalDisasterApi;
