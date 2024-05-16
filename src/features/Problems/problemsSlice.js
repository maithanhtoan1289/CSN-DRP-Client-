import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import problemApi from "../../api/problemApi";

const initialState = {
  totalPages: null,
  currentPage: null,
  limit: null,
  list: [],
  status: "initial",
  error: null,
};

export const getAllProblemByPageAndLimit = createAsyncThunk(
  "problem/getAllProblemByPageAndLimit",
  async ({ pagination }) => {
    const { page, limit } = pagination;
    try {
      const response = await problemApi.getAllProblemByPageAndLimit(
        page,
        limit
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addProblemVersion1 = createAsyncThunk(
  "naturalDisaster/addProblemVersion1",
  async (data) => {
    try {
      const response = await problemApi.addProblemVersion1(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addProblemVersion2 = createAsyncThunk(
  "naturalDisaster/addProblemVersion2",
  async (data) => {
    try {
      const response = await problemApi.addProblemVersion2(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Task 5
export const addProblemVersion3 = createAsyncThunk(
  "naturalDisaster/addProblemVersion3",
  async (data) => {
    try {
      const response = await problemApi.addProblemVersion3(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addProblemStatus = createAsyncThunk(
  "naturalDisaster/addProblemStatus",
  async (data) => {
    try {
      const response = await problemApi.addProblemStatus(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Task 1
export const editProblemPriority = createAsyncThunk(
  "naturalDisaster/editProblemPriority",
  async (data) => {
    try {
      const response = await problemApi.editProblemPriority(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Problem
      .addCase(getAllProblemByPageAndLimit.pending, (state) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllProblemByPageAndLimit.fulfilled, (state, action) => {
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
        state.limit = action.payload.data.limit;
        state.list = action.payload.data.rows;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllProblemByPageAndLimit.rejected, (state, action) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Problem Version 1
      .addCase(addProblemVersion1.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProblemVersion1.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addProblemVersion1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Problem Version 2
      .addCase(addProblemVersion2.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProblemVersion2.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addProblemVersion2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Task 5
      // Add Problem Version 3
      .addCase(addProblemVersion3.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProblemVersion3.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addProblemVersion3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Natural Disaster Status
      .addCase(addProblemStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addProblemStatus.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addProblemStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Task 1
      // Edit Problem Priority
      .addCase(editProblemPriority.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editProblemPriority.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(editProblemPriority.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default problemSlice.reducer;
