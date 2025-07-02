import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProblemsByManager = createAsyncThunk(
  "problem/fetchByManager",
  async (managerId, thunkAPI) => {
    const response = await axios.get(
      `/problem/getProblemsByManagerDepartment/${managerId}`
    );
    return response.data;
  }
);

export const createProblem = createAsyncThunk(
  "problem/createProblem",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/problem/create", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
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
      })

      .addCase(createProblem.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProblem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.problemsList.push(action.payload);
      })
      .addCase(createProblem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default problemsSlice.reducer;
