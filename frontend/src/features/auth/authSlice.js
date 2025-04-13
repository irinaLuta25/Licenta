import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const getUserFromCookie = createAsyncThunk(
  'auth/getUserFromCookie',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/user/getUserFromCookie', {
        withCredentials: true
      })
      return res.data
    } catch (err) {
      if (err.response?.status === 400) {
        return rejectWithValue(null);
      }
      return rejectWithValue(err.message || 'Unexpected error');
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await axios.post('/user/logout', null, {
      withCredentials: true
    })
    return null
  }
)

const initialState = {
  user: null,
  loading: false,
  error: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserFromCookie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserFromCookie.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(getUserFromCookie.rejected, (state) => {
        state.loading = false
        state.user = null
        state.error = 'Not authenticated'
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
  }
})

export default authSlice.reducer
