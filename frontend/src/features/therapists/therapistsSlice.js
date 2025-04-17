import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllTherapists = createAsyncThunk(
  "therapists/getAllTherapists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/specialist/getAllTherapists");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getTherapistById = createAsyncThunk(
  "therapists/getTherapistById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/specialist/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getSpecialistByUserId = createAsyncThunk(
  "therapists/getByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      console.log("FETCH SPECIALIST for USER ID: ", userId);

      const res = await axios.get(
        `/specialist/getSpecialistByUserId/${userId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getIntervalsForTherapist = createAsyncThunk(
  "therapists/getIntervalsForTherapist",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/interval/getAllAvailableIntervalsBySpecialistId/${id}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const therapistsSlice = createSlice({
  name: "therapists",
  initialState: {
    list: [],
    selectedTherapist: null,
    freeIntervals: [],
    loading: false,
    error: null,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTherapists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTherapists.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getAllTherapists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTherapistById.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTherapistById.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.selectedTherapist = action.payload;
      })
      .addCase(getTherapistById.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getSpecialistByUserId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSpecialistByUserId.fulfilled, (state, action) => {
        console.log("Payload din fulfilled:", action.payload);
        state.status = "succeeded";
        state.selectedTherapist = action.payload;
      })
      .addCase(getSpecialistByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(getIntervalsForTherapist.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getIntervalsForTherapist.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.freeIntervals = action.payload;
      })
      .addCase(getIntervalsForTherapist.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default therapistsSlice.reducer;
