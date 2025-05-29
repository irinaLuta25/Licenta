import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

// Thunk: Fetch mood evolution data pentru managerId și lună/an
export const fetchMoodEvolution = createAsyncThunk(
  "reports/fetchMoodEvolution",
  async ({ managerId, month, year }) => {
    const response = await axios.get(
      `/report/getMoodEvolution/${managerId}?month=${month}&year=${year}`
    );
    return response.data;
  }
);

export const fetchMoodFrequency = createAsyncThunk(
  "reports/fetchMoodFrequency",
  async ({ managerId, month, year }) => {
    const response = await axios.get(
      `/report/getMoodFrequency/${managerId}?month=${month}&year=${year}`
    );
    return response.data;
  }
);

export const fetchProblemsPerMonth = createAsyncThunk(
  "reports/fetchProblemsPerMonth",
  async ({ managerId, year }) => {
    const res = await axios.get(`/report/getProblemsPerMonth/${managerId}?year=${year}`);
    return res.data;
  }
);

export const getEventTypeDistribution = createAsyncThunk(
  "reports/getEventTypeDistribution",
  async ({ managerId, year }) => {
    const res = await axios.get(
      `/report/getEventTypeDistribution/${managerId}?year=${year}`
    );
    return res.data;
  }
);

export const getEventParticipationOverTime = createAsyncThunk(
  "reports/getEventParticipationOverTime",
  async ({ managerId, year }) => {
    const res = await axios.get(`/report/getEventParticipationOverTime/${managerId}?year=${year}`);
    return res.data;
  }
);

export const getTherapySatisfactionDistribution = createAsyncThunk(
  "reports/getTherapySatisfactionDistribution",
  async ({ managerId, year }) => {
    const res = await axios.get(
      `/report/getTherapySatisfactionDistribution/${managerId}?year=${year}`
    );
    return res.data;
  }
);



const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    moodEvolution: [],
    moodFrequency: [],
    problemsPerMonth: [],
    eventTypeDistribution: [],
    therapySatisfactionDistribution: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMoodEvolution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEvolution.fulfilled, (state, action) => {
        state.loading = false;
        state.moodEvolution = action.payload;
      })
      .addCase(fetchMoodEvolution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

       .addCase(fetchMoodFrequency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodFrequency.fulfilled, (state, action) => {
        state.loading = false;
        state.moodFrequency = action.payload;
      })
      .addCase(fetchMoodFrequency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProblemsPerMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProblemsPerMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.problemsPerMonth = action.payload;
      })
      .addCase(fetchProblemsPerMonth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getEventTypeDistribution.fulfilled, (state, action) => {
        state.eventTypeDistribution = action.payload;
      })

      .addCase(getTherapySatisfactionDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTherapySatisfactionDistribution.fulfilled, (state, action) => {
        console.log("raspuns back",action.payload)

        state.loading = false;
        state.therapySatisfactionDistribution = action.payload;
      })
      .addCase(getTherapySatisfactionDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default reportsSlice.reducer;
