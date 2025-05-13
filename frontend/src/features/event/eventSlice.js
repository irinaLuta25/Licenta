import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllEvents = createAsyncThunk(
    'event/getAllEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("/event/getAll");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const getAllEventsByTargetDepartment = createAsyncThunk(
    'event/getAllEventsByTargetDepartment',
    async (department, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/event/getAllEventsByTargetDepartment/${department}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)


export const getAllEventsBySpecialistId = createAsyncThunk(
    'event/getAllEventsBySpecialistId',
    async (specialistId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/event/getAllEventsBySpecialistId/${specialistId}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const deleteEventById = createAsyncThunk(
    'event/deleteEventById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/event/delete/${id}`);
            return { id };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createEvent = createAsyncThunk(
    'event/createEvent',
    async (payload, { rejectWithValue }) => {
      try {
        const response = await axios.post('/event/create', payload);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
);


const eventSlice = createSlice({
    name: "event",
    initialState: {
        list: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllEvents.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllEvents.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(getAllEvents.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(getAllEventsByTargetDepartment.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllEventsByTargetDepartment.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload
            })
            .addCase(getAllEventsByTargetDepartment.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(getAllEventsBySpecialistId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllEventsBySpecialistId.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getAllEventsBySpecialistId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteEventById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEventById.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter(event => event.id !== action.payload.id);
            })
            .addCase(deleteEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(createEvent.pending, (state) => {
                state.status = 'loading';
                state.error = null;
              })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list.push(action.payload);
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

    }
})

export default eventSlice.reducer;
