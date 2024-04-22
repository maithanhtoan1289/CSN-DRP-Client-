import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import employeeApi from "../../api/employeeApi";

const initialState = {
  totalPages: null,
  currentPage: null,
  limit: null,
  list: [],
  status: "initial",
  error: null,
};

export const getAllEmployeeByPageAndLimit = createAsyncThunk(
  "employee/getAllEmployeeByPageAndLimit",
  async ({ pagination }) => {
    const { page, limit } = pagination;
    try {
      const response = await employeeApi.getAllEmployeeByPageAndLimit(
        page,
        limit
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all user
      .addCase(getAllEmployeeByPageAndLimit.pending, (state) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllEmployeeByPageAndLimit.fulfilled, (state, action) => {
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
        state.limit = action.payload.data.limit;
        state.list = action.payload.data.rows;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllEmployeeByPageAndLimit.rejected, (state, action) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeeSlice.reducer;
