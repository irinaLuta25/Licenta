import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createEmployeeEvent = createAsyncThunk(
    "employeeEvent/create",
    async (sessionData, { rejectWithValue }) => {
        try {
          const response = await axios.post('/employeeEvent/create',sessionData)
          return response.data
        } catch (err) {
          return rejectWithValue(err.response?.data || err.message)
        }
    }
)

export const getEmployeeEventsByEmployeeId = createAsyncThunk(
    "employeeEvent/getByEmployeeId",
    async (employeeId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`/employeeEvent/getAllEmployeeEventsByEmployeeId/${employeeId}`);
        console.log("raspuns din back", response.data)
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

const employeeEventSlice = createSlice({
    name: "employeeEvent",
    initialState: {
      createdEvent: null,
      employeeEvents: [],
      status: "idle",
      error: null,
    },
    reducers: {
      resetEmployeeEventState: (state) => {
        state.createdEvent = null;
        state.status = "idle";
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(createEmployeeEvent.pending, (state) => {
          state.status = "loading";
          state.error = null;
        })
        .addCase(createEmployeeEvent.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.createdEvent = action.payload;
        })
        .addCase(createEmployeeEvent.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        .addCase(getEmployeeEventsByEmployeeId.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.employeeEvents = action.payload;
        })
    },
  });
  
  export const { resetEmployeeEventState } = employeeEventSlice.actions;
  export default employeeEventSlice.reducer;