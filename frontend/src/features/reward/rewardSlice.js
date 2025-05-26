import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllRewards = createAsyncThunk(
  "reward/fetchAll",
  async () => {
    const res = await axios.get("/reward/getAll");
    return res.data;
  }
);

const rewardSlice = createSlice({
  name: "reward",
  initialState: {
    rewards: [], 
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRewards.fulfilled, (state, action) => {
        state.rewards = action.payload;
      });
  },
});

export default rewardSlice.reducer;
