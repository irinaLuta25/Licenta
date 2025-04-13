import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateIntervalStatus = createAsyncThunk(
  "interval/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/interval/updateIntervalStatus/${id}`, {
            status: status
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const intervalSlice = createSlice({
  name: "interval",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateIntervalStatus.fulfilled, (state, action) => {
      console.log("Status updated for interval:", action.payload);
    });
  }
});

export default intervalSlice.reducer;
