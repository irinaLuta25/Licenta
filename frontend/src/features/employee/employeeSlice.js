import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getEmployeeByUserId = createAsyncThunk(
  "employee/getByUserId",
  async (userId, { rejectWithValue }) => {
    try {
        console.log("FETCH EMPLOYEE for USER ID: ", userId)

      const res = await axios.get(`/employee/getEmployeeByUserId/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    employee: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmployeeByUserId.fulfilled, (state, action) => {
        console.log("Payload din fulfilled:", action.payload);
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(getEmployeeByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
