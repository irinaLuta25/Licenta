import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAnswer = createAsyncThunk(
    'answers/create',
    async (answerData, { rejectWithValue }) => {
        try {
            const res = await axios.post('/answer/create', answerData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const getAllAnswersByQuestionId = createAsyncThunk(
    'answers/getByQuestionId',
    async ({ questionId }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/answer/getAllAnswersByQuestionId/${questionId}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const checkHasFeedbackForTherapySession = createAsyncThunk(
    'answers/checkForTherapySession',
    async ({ therapySessionId, employeeId }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/answer/checkFeedbackForTherapySession/${therapySessionId}/${employeeId}`);
            return { key: `therapy-${therapySessionId}`, hasFeedback: res.data.hasFeedback };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const checkHasFeedbackForEvent = createAsyncThunk(
    'answers/checkForEvent',
    async ({ eventId, employeeId }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/answer/checkFeedbackForEvent/${eventId}/${employeeId}`);
            return { key: `event-${eventId}`, hasFeedback: res.data.hasFeedback };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const answerSlice = createSlice({
    name: 'answers',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
        feedbackStatus: {},
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAnswersByQuestionId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllAnswersByQuestionId.fulfilled, (state, action) => {
                state.list = action.payload;
                state.status = 'succeeded';
            })
            .addCase(getAllAnswersByQuestionId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(createAnswer.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createAnswer.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(createAnswer.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(checkHasFeedbackForTherapySession.fulfilled, (state, action) => {
                state.feedbackStatus[action.payload.key] = action.payload.hasFeedback;
            })
            .addCase(checkHasFeedbackForEvent.fulfilled, (state, action) => {
                state.feedbackStatus[action.payload.key] = action.payload.hasFeedback;
            })

    },
});

export default answerSlice.reducer;