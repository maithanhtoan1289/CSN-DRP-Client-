import axiosClient from "./axiosClient";

const employeeApi = {
  getAllEmployeeByPageAndLimit: async (page, limit) => {
    const url = `/employees?page=${page}&limit=${limit}`;
    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default employeeApi;
