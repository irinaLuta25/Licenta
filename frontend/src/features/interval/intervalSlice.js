
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createInterval = createAsyncThunk(
  "interval/create",
  async ({ date, beginTime, endTime, specialistId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/interval/create", {
        date,
        beginTime,
        endTime,
        status:false,
        specialistId
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

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

export const getIntervalById = createAsyncThunk(
  "interval/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/interval/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllIntervals = createAsyncThunk(
  "interval/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/interval/getAll");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const intervalSlice = createSlice({
  name: "interval",
  initialState: {
    intervalsById: {},
    status: "idle",
    error: null,
  },
  reducers: {
    resetIntervalState: (state) => {
      state.intervalsById = {};
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createInterval.fulfilled, (state, action) => {
        const interval = action.payload;
        state.intervalsById[interval.id] = interval;
      })
      .addCase(updateIntervalStatus.fulfilled, (state, action) => {
        const updatedInterval = action.payload;
        state.intervalsById[updatedInterval.id] = updatedInterval;
      })

      .addCase(getIntervalById.fulfilled, (state, action) => {
        const interval = action.payload;
        state.intervalsById[interval.id] = interval;
      })

      .addCase(getAllIntervals.fulfilled, (state, action) => {
        const allIntervals = action.payload;
        allIntervals.forEach(interval => {
          state.intervalsById[interval.id] = interval;
        });
      });
  }
});

export const { resetIntervalState } = intervalSlice.actions;
export default intervalSlice.reducer;
