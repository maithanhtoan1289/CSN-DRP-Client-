import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadApi from "../../api/uploadApi";

const initialState = {
  url: null,
  status: "initial",
  error: null,
};

export const addImage = createAsyncThunk(
  "upload/addImage",
  async (formData) => {
    try {
      const response = await uploadApi.addImage(formData);
      // return response;
      console.log("response SLICE", response);
    } catch (error) {
      throw error;
    }
  }
);

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(addImage.pending, (state) => {
        state.url = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(addImage.fulfilled, (state, action) => {
        state.url = null;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addImage.rejected, (state, action) => {
        state.url = null;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default uploadsSlice.reducer;
