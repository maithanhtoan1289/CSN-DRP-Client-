import axiosClient from "./axiosClient";

const historyApi = {
  getAllHistoryNaturalDisasterByPageAndLimit: async (page, limit) => {
    const url = `/histories/natural-disasters?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getAllHistoryProblemByPageAndLimit: async (page, limit) => {
    const url = `/histories/problems?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default historyApi;
