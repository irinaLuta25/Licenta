import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTherapySession = createAsyncThunk(
  "therapySessions/create",
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/therapySession/create", sessionData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateTherapySession = createAsyncThunk(
  "therapySessions/update",
  async ({ therapySessionId, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/therapySession/update/${therapySessionId}`,
        updates
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteTherapySession = createAsyncThunk(
  "therapySessions/deleteTherapySession",
  async (therapySessionId, { rejectWithValue }) => {
    try {
      await axios.delete(`/therapySession/delete/${therapySessionId}`);
      return { id: therapySessionId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllTherapySessions = createAsyncThunk(
  "therapySessions/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/therapySession/getAll");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllTherapySessionsBySpecialistId = createAsyncThunk(
  "therapySessions/getAllTherapySessionsBySpecialistId",
  async (specialistId, { rejectWithValue }) => {
    try {
      console.log(specialistId);
      const response = await axios.get(
        `/therapySession/getAllTherapySessionsBySpecialistId/${specialistId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getAllTherapySessionsByEmployeeId = createAsyncThunk(
  "therapySessions/getAllTherapySessionsByEmployeeId",
  async (employeeId, { rejectWithValue }) => {
    try {
      console.log(employeeId);
      const response = await axios.get(
        `/therapySession/getAllTherapySessionsByEmployeeId/${employeeId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const therapySessionsSlice = createSlice({
  name: "therapySessions",
  initialState: {
    loading: false,
    success: false,
    error: null,
    list: [],
    count: 0
  },
  reducers: {
    resetTherapySessionStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
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
      })

      .addCase(updateTherapySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTherapySession.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateTherapySession.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      .addCase(deleteTherapySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTherapySession.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(
          (session) => session.id !== action.payload.id
        );
        state.success = true;
      })
      .addCase(deleteTherapySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      .addCase(getAllTherapySessionsBySpecialistId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllTherapySessionsBySpecialistId.fulfilled,
        (state, action) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(
        getAllTherapySessionsBySpecialistId.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(getAllTherapySessionsByEmployeeId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTherapySessionsByEmployeeId.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllTherapySessionsByEmployeeId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllTherapySessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTherapySessions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.rows;
        state.count = action.payload.count;
      })
      .addCase(getAllTherapySessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTherapySessionStatus } = therapySessionsSlice.actions;
export default therapySessionsSlice.reducer;
