import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRewardsByEmployee = createAsyncThunk(
  "employeeReward/fetchByEmployee",
  async (employeeId) => {
    const res = await axios.get(`/employeeReward/getAllRewardsByEmployeeId/${employeeId}`);
    return res.data;
  }
);

const employeeRewardSlice = createSlice({
  name: "employeeReward",
  initialState: {
    rewards: [], 
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRewardsByEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRewardsByEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rewards = action.payload;
      })
      .addCase(fetchRewardsByEmployee.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default employeeRewardSlice.reducer;
