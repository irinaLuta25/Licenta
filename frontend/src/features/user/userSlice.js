import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, user }, thunkAPI) => {
    try {
      const formData = new FormData();

      for (const key in user) {
        if (key === "profileImage") {
          if (user.profileImage instanceof File) {
            formData.append("profileImage", user.profileImage);
          }
        } else {
          formData.append(key, user[key]);
        }
      }

      const response = await axios.put(`/user/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.fulfilled, (state, action) => {
        const user = action.payload;
        state.usersById[user.id] = user;
        state.user = user;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload;
        state.user = updated;
        state.usersById[updated.id] = updated;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
