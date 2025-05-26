import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchHabitTrackingByGoalId = createAsyncThunk(
  "habitTracking/fetchByGoalId",
  async (goalId) => {
    const res = await axios.get(
      `/habitTracking/getAllHabitTrackingByEmployeeGoalId/${goalId}`
    );
    return { goalId, data: res.data };
  }
);

export const createHabitTracking = createAsyncThunk(
  "habitTracking/createHabitTracking",
  async ({ employeeGoalId, value }) => {
    const res = await axios.post("/habitTracking/create", {
      employeeGoalId,
      value,
      recordedAt: new Date(),
    });
    return res.data;
  }
);

const habitTrackingSlice = createSlice({
  name: "habitTracking",
  initialState: {
    trackingsByGoalId: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitTrackingByGoalId.fulfilled, (state, action) => {
        const { goalId, data } = action.payload;
        state.trackingsByGoalId[goalId] = Array.isArray(data) ? data : [];
      })

      .addCase(createHabitTracking.fulfilled, (state, action) => {
        const tracking = action.payload;
        const goalId = tracking.employeeGoalId;
        if (!state.trackingsByGoalId[goalId]) {
          state.trackingsByGoalId[goalId] = [];
        }
        state.trackingsByGoalId[goalId].push(tracking);
      });
  },
});

export default habitTrackingSlice.reducer;
