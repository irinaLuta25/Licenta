import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const createTherapySession = createAsyncThunk(
    "therapySessions/create",
    async (sessionData, { rejectWithValue }) => {
        try {
          const response = await axios.post('/therapySession/create',sessionData)
          return response.data
        } catch (err) {
          return rejectWithValue(err.response?.data || err.message)
        }
    }
)

const therapySessionsSlice = createSlice({
    name: 'therapySessions',
    initialState: {
      loading: false,
      success: false,
      error: null
    },
    reducers: {
      resetTherapySessionStatus: (state) => {
        state.loading = false;
        state.success = false;
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(createTherapySession.pending, (state) => {
          state.loading = true;
          state.success = false;
          state.error = null;
        })
        .addCase(createTherapySession.fulfilled, (state) => {
          state.loading = false;
          state.success = true;
        })
        .addCase(createTherapySession.rejected, (state, action) => {
          state.loading = false;
          state.success = false;
          state.error = action.payload;
        });
    }
  });
  

  export const { resetTherapySessionStatus } = therapySessionsSlice.actions;
  export default therapySessionsSlice.reducer;