import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProblemsByManager = createAsyncThunk(
  "problem/fetchByManager",
  async (managerId, thunkAPI) => {
    const response = await axios.get(`/problem/getProblemsByManagerDepartment/${managerId}`);
    return response.data;
  }
);

const problemsSlice = createSlice({
  name: "problem",
  initialState: {
    problemsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblemsByManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemsByManager.fulfilled, (state, action) => {
        state.loading = false;
        state.problemsList = action.payload;
      })
      .addCase(fetchProblemsByManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default problemsSlice.reducer;
