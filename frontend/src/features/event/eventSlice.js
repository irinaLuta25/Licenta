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

    }
})

export default eventSlice.reducer;
