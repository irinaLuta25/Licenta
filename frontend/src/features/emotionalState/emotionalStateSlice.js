import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createEmotionalState = createAsyncThunk(
  "emotionalState/createEmotionalState",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/emotionalState/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Eroare la creare stare emoțională");
    }
  }
);

export const fetchEmotionalStatesByEmployeeId = createAsyncThunk(
  "emotionalState/fetchByEmployeeId",
  async (employeeId, thunkAPI) => {
    try {
      const response = await axios.get(`/emotionalState/getAllEmotionalStatesByEmployeeId/${employeeId}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const emotionalStateSlice = createSlice({
  name: "emotionalState",
  initialState: {
    loading: false,
    error: null,
    createdState: null,
    states: [], 
  },
  reducers: {
    clearEmotionalState: (state) => {
      state.createdState = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEmotionalState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmotionalState.fulfilled, (state, action) => {
        state.loading = false;
        state.createdState = action.payload;
      })
      .addCase(createEmotionalState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchEmotionalStatesByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmotionalStatesByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchEmotionalStatesByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEmotionalState } = emotionalStateSlice.actions;

export default emotionalStateSlice.reducer;
