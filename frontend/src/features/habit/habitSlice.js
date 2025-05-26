import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH ALL HABITS
export const fetchAllHabits = createAsyncThunk(
  "habit/fetchAllHabits",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/habit/getAll");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const habitSlice = createSlice({
  name: "habit",
  initialState: {
    habits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchAllHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default habitSlice.reducer;
