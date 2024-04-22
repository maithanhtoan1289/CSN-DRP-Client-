import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import goongApi from "../../api/goongApi";

const initialState = {
  address: null,
  locationLat: null,
  locationLng: null,
  status: "initial",
  error: null,
};

export const geocoding = createAsyncThunk("goong/geocoding", async (data) => {
  try {
    const response = await goongApi.geocoding(data);
    return response[0];
  } catch (error) {
    throw error;
  }
});

export const reverseGeocoding = createAsyncThunk(
  "goong/reverseGeocoding",
  async (data) => {
    try {
      const response = await goongApi.reverseGeocoding(data);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const direction = createAsyncThunk("goong/direction", async (data) => {
  try {
    const response = await goongApi.direction(data);
    return response;
  } catch (error) {
    throw error;
  }
});

const goongSlice = createSlice({
  name: "goong",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Geocoding
      .addCase(geocoding.pending, (state) => {
        state.address = null;
        state.locationLat = null;
        state.locationLng = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(geocoding.fulfilled, (state, action) => {
        const { name, geometry } = action.payload;
        const { lat, lng } = geometry.location;
        state.address = name;
        state.locationLat = lat;
        state.locationLng = lng;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(geocoding.rejected, (state, action) => {
        state.address = null;
        state.locationLat = null;
        state.locationLng = null;
        state.status = "failed";
        state.error = action.error.message;
      })

      // Direction
      .addCase(direction.pending, (state) => {
        state.address = null;
        state.locationLat = null;
        state.locationLng = null;
        state.status = "loading";
        state.error = null;
      })
      .addCase(direction.fulfilled, (state, action) => {
        // const { name, geometry } = action.payload;
        // const { lat, lng } = geometry.location;
        // state.address = name;
        // state.locationLat = lat;
        // state.locationLng = lng;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(direction.rejected, (state, action) => {
        state.address = null;
        state.locationLat = null;
        state.locationLng = null;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default goongSlice.reducer;
