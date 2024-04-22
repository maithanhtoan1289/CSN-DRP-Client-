import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import historyApi from "../../api/historyApi";

const initialState = {
  totalPages: null,
  currentPage: null,
  limit: null,
  list: [],
  status: "initial",
  error: null,
};

export const getAllHistoryProblemByPageAndLimit = createAsyncThunk(
  "history/getAllHistoryProblemByPageAndLimit",
  async ({ pagination }) => {
    const { page, limit } = pagination;
    try {
      const response = await historyApi.getAllHistoryProblemByPageAndLimit(
        page,
        limit
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const historyNaturalDisastersSlice = createSlice({
  name: "historyProblem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all history problem
      .addCase(getAllHistoryProblemByPageAndLimit.pending, (state) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllHistoryProblemByPageAndLimit.fulfilled,
        (state, action) => {
          state.totalPages = action.payload.data.totalPages;
          state.currentPage = action.payload.data.currentPage;
          state.limit = action.payload.data.limit;
          state.list = action.payload.data.rows;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(getAllHistoryProblemByPageAndLimit.rejected, (state, action) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = null;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default historyNaturalDisastersSlice.reducer;
