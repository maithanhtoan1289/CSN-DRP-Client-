import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import naturalDisasterApi from "../../api/naturalDisasterApi";

const initialState = {
  totalPages: null,
  currentPage: null,
  limit: null,
  list: [],
  status: "initial",
  error: null,
};

export const getAllNaturalDisasterByPageAndLimit = createAsyncThunk(
  "naturalDisaster/getAllNaturalDisasterByPageAndLimit",
  async ({ pagination }) => {
    const { page, limit } = pagination;
    try {
      const response =
        await naturalDisasterApi.getAllNaturalDisasterByPageAndLimit(
          page,
          limit
        );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addNaturalDisasterVersion1 = createAsyncThunk(
  "naturalDisaster/addNaturalDisasterVersion1",
  async (data) => {
    try {
      const response = await naturalDisasterApi.addNaturalDisasterVersion1(
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addNaturalDisasterVersion2 = createAsyncThunk(
  "naturalDisaster/addNaturalDisasterVersion2",
  async (data) => {
    try {
      const response = await naturalDisasterApi.addNaturalDisasterVersion2(
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Task 5
export const addNaturalDisasterVersion3 = createAsyncThunk(
  "naturalDisaster/addNaturalDisasterVersion3",
  async (data) => {
    try {
      const response = await naturalDisasterApi.addNaturalDisasterVersion3(
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addNaturalDisasterStatus = createAsyncThunk(
  "naturalDisaster/addNaturalDisasterStatus",
  async (data) => {
    try {
      const response = await naturalDisasterApi.addNaturalDisasterStatus(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Task 1
export const editNaturalDisasterPriority = createAsyncThunk(
  "naturalDisaster/editNaturalDisasterPriority",
  async (data) => {
    try {
      const response = await naturalDisasterApi.editNaturalDisasterPriority(
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const naturalDisasterSlice = createSlice({
  name: "naturalDisaster",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get all Natural Disaster
      .addCase(getAllNaturalDisasterByPageAndLimit.pending, (state) => {
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        getAllNaturalDisasterByPageAndLimit.fulfilled,
        (state, action) => {
          state.totalPages = action.payload.data.totalPages;
          state.currentPage = action.payload.data.currentPage;
          state.limit = action.payload.data.limit;
          state.list = action.payload.data.rows;
          state.status = "succeeded";
          state.error = null;
        }
      )
      .addCase(
        getAllNaturalDisasterByPageAndLimit.rejected,
        (state, action) => {
          state.totalPages = null;
          state.currentPage = null;
          state.limit = null;
          state.list = null;
          state.status = "failed";
          state.error = action.error.message;
        }
      )

      // Add Natural Disaster Version 1
      .addCase(addNaturalDisasterVersion1.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion1.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion1.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Natural Disaster Version 2
      .addCase(addNaturalDisasterVersion2.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion2.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion2.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Task 5
      // Add Natural Disaster Version 3
      .addCase(addNaturalDisasterVersion3.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion3.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addNaturalDisasterVersion3.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add Natural Disaster Status
      .addCase(addNaturalDisasterStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNaturalDisasterStatus.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(addNaturalDisasterStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Task 1
      // Edit Natural Disaster Priority
      .addCase(editNaturalDisasterPriority.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(editNaturalDisasterPriority.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(editNaturalDisasterPriority.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUserInfo } = naturalDisasterSlice.actions;
export default naturalDisasterSlice.reducer;
