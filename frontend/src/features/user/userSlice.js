import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUserById = createAsyncThunk(
  "user/getById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    usersById: {},
    status: "idle",
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        const user = action.payload;
        state.usersById[user.id] = user;
      })
  }
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
