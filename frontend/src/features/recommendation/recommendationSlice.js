import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecommendations = createAsyncThunk(
  'recommendation/fetchRecommendations',
  async (employeeId, { rejectWithValue }) => {
    try {
      console.log(employeeId)
      const response = await axios.get(`/recommendation/${employeeId}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRecommendations: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Eroare la încărcarea recomandărilor';
      });
  }
});

export const { clearRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer;
