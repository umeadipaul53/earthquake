import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEarthquakesAPI } from "../services/api";

export const fetchEarthQuakes = createAsyncThunk(
  "earthquake/fetchearthquakes",
  async ({ starttime, endtime, magnitude }) => {
    try {
      return await fetchEarthquakesAPI(starttime, endtime, magnitude);
    } catch (error) {
      throw error;
    }
  }
);

const earthquakeSlice = createSlice({
  name: "earthquake",
  initialState: {
    data: [],
    loading: false,
    error: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarthQuakes.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchEarthQuakes.fulfilled, (state, action) => {
        (state.loading = false),
          (state.error = false),
          (state.data = action.payload);
      })
      .addCase(fetchEarthQuakes.rejected, (state) => {
        (state.error = true), (state.loading = false);
      });
  },
});

export default earthquakeSlice.reducer;
