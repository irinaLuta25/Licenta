import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

// Thunk: Fetch mood evolution data pentru managerId și lună/an
export const fetchMoodEvolution = createAsyncThunk(
  "reports/fetchMoodEvolution",
  async ({ managerId, month, year }) => {
    const response = await axios.get(
      `/report/getMoodEvolution/${managerId}?month=${month}&year=${year}`
    );
    return response.data;
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    moodEvolution: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodEvolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEvolution.fulfilled, (state, action) => {
        console.log("raspuns back",action.payload)
        state.loading = false;
        state.moodEvolution = action.payload;
      })
      .addCase(fetchMoodEvolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportsSlice.reducer;
