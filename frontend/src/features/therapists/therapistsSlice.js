import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getAllTherapists = createAsyncThunk(
  'therapists/getAllTherapists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/specialist/getAllTherapists')
      return response.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const therapistsSlice = createSlice({
  name: 'therapists',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTherapists.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(getAllTherapists.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export default therapistsSlice.reducer
