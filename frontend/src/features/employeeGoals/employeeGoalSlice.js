import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEmployeeGoals = createAsyncThunk(
  "employeeGoals/fetchEmployeeGoals",
  async (employeeId) => {
    const res = await axios.get(
      `/employeeGoal/getAllEmployeeGoalsByEmployeeId/${employeeId}`
    );
    return res.data;
  }
);

export const createEmployeeGoal = createAsyncThunk(
  "employeeGoals/createEmployeeGoal",
  async (goalData) => {
    const res = await axios.post("/employeeGoal/create", goalData);
    return res.data;
  }
);

export const deleteEmployeeGoal = createAsyncThunk(
  "employeeGoals/deleteEmployeeGoal",
  async (goalId, thunkAPI) => {
    try {
      await axios.delete(`/employeeGoal/delete/${goalId}`);
      return goalId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const employeeGoalSlice = createSlice({
  name: "employeeGoals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeGoals.fulfilled, (state, action) => {
        state.goals = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployeeGoals.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      .addCase(createEmployeeGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })

      .addCase(deleteEmployeeGoal.fulfilled, (state, action) => {
      state.goals = state.goals.filter((g) => g.id !== action.payload);
    })
  },
});

export default employeeGoalSlice.reducer;
