import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, employee }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/employee/update/${id}`, employee);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getEmployeeByUserId = createAsyncThunk(
  "employee/getByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("FETCH EMPLOYEE for USER ID: ", userId);

      const res = await axios.get(`/employee/getEmployeeByUserId/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getEmployeeById = createAsyncThunk(
  "employee/getEmployeeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/employee/${id}`);
      return response.data;
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
      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getEmployeeByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEmployeeByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(getEmployeeByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getEmployeeById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getEmployeeById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employee = action.payload;
      })
      .addCase(getEmployeeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
