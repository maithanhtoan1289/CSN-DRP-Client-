import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import userApi from "../../api/userApi";

const initialState = {
  userInfo: null,
  totalPages: null,
  currentPage: null,
  limit: null,
  list: [],
  listSeeker: [],
  status: "initial",
  error: null,
};

export const loginUser = createAsyncThunk("auth/login", async (data) => {
  try {
    const response = await authApi.loginUser(data);
    return response;
  } catch (error) {
    throw error;
  }
});

export const registerUser = createAsyncThunk("auth/register", async (data) => {
  try {
    const response = await authApi.registerUser(data);
    return response;
  } catch (error) {
    throw error;
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await authApi.logoutUser();
    return response;
  } catch (error) {
    throw error;
  }
});

export const getAllUserByPageAndLimit = createAsyncThunk(
  "user/getAllUserByPageAndLimit",
  async ({ pagination }) => {
    const { page, limit } = pagination;
    try {
      const response = await userApi.getAllUserByPageAndLimit(page, limit);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const addCoordinates = createAsyncThunk(
  "user/addCoordinates",
  async (data) => {
    try {
      const response = await userApi.addCoordinates(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getAllRescueNeeded = createAsyncThunk(
  "user/getAllRescueNeeded",
  async () => {
    try {
      const response = await userApi.getAllRescueNeeded();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// New
export const getAllRescueSeeker = createAsyncThunk(
  "user/getAllRescueSeeker",
  async () => {
    try {
      const response = await userApi.getAllRescueSeeker();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const getAllRescueHistory = createAsyncThunk(
  "user/getAllRescueHistory",
  async () => {
    try {
      const response = await userApi.getAllRescueHistory();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    // New
    clearUserInfo: (state, action) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const {
          id,
          name,
          username,
          email,
          avatar,
          coordinates,
          address,
          role,
        } = action.payload.data;
        state.userInfo = {
          id,
          name,
          username,
          email,
          avatar,
          coordinates,
          address,
          role,
        };
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // Get all user
      .addCase(getAllUserByPageAndLimit.pending, (state) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllUserByPageAndLimit.fulfilled, (state, action) => {
        // state.userInfo = null;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
        state.limit = action.payload.data.limit;
        state.list = action.payload.data.rows;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllUserByPageAndLimit.rejected, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // Get all rescue needed
      .addCase(getAllRescueNeeded.pending, (state) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllRescueNeeded.fulfilled, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = action.payload.data.rows;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllRescueNeeded.rejected, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // New
      // Get all rescue seeker
      .addCase(getAllRescueSeeker.pending, (state) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.listSeeker = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllRescueSeeker.fulfilled, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.listSeeker = action.payload.data.rows;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllRescueSeeker.rejected, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.listSeeker = [];
        state.status = "failed";
        state.error = action.error.message;
      })

      // Get all rescue history
      .addCase(getAllRescueHistory.pending, (state) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllRescueHistory.fulfilled, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = action.payload.data;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getAllRescueHistory.rejected, (state, action) => {
        // state.userInfo = null;
        state.totalPages = null;
        state.currentPage = null;
        state.limit = null;
        state.list = [];
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// New
export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
