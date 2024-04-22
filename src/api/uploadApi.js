import axios from "axios";

const uploadApi = {
  addImage: async (formData) => {
    const url = `/upload/add-image`;
    try {
      const response = await axios.post(url, formData);
      // return response.data.results;
      console.log("response API", response);
    } catch (error) {
      throw error;
    }
  },
};

export default uploadApi;
