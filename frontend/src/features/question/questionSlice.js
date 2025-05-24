import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllQuestions = createAsyncThunk(
    'questions/getAll',
    async (_, { rejectWithValue }) => {
      try {
        const res = await axios.get('/question/getAll');
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const getQuestionById = createAsyncThunk(
    'questions/getById',
    async (id, { rejectWithValue }) => {
      try {
        const res = await axios.get(`/question/${id}`);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const getQuestionsByEventId = createAsyncThunk(
    'questions/getByEventId',
    async (eventId, { rejectWithValue }) => {
      try {
        const res = await axios.get(`/question/getAllQuestionsByEventId/${eventId}`);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const getQuestionsByTherapySessionId = createAsyncThunk(
    'questions/getByTherapySessionId',
    async (therapySessionId, { rejectWithValue }) => {
      try {
        const res = await axios.get(`/question/getAllQuestionsByTherapySessionId/${therapySessionId}`);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const getQuestionsBySpecialistId = createAsyncThunk(
    'questions/getBySpecialistId',
    async (id, { rejectWithValue }) => {
      try {
        const res = await axios.get(`/question/getAllQuestionsBySpecialistId/${id}`);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const createQuestionForEvent = createAsyncThunk(
    'questions/createForEvent',
    async (payload, { rejectWithValue }) => {
      try {
        const res = await axios.post('/question/createForEvent', payload);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const createQuestionForTherapySession = createAsyncThunk(
    'questions/createForTherapy',
    async (payload, { rejectWithValue }) => {
      try {
        const res = await axios.post('/question/createForTherapy', payload);
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const updateQuestion = createAsyncThunk(
    'questions/update',
    async ({ id, text }, { rejectWithValue }) => {
      try {
        const res = await axios.put(`/question/update/${id}`, { text });
        return res.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  export const deleteQuestion = createAsyncThunk(
    'questions/delete',
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`/question/delete/${id}`);
        return id;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  
  const questionSlice = createSlice({
    name: 'questions',
    initialState: {
      list: [],
      selected: null,
      status: 'idle',
      error: null,
    },
    reducers: {
      resetQuestions: (state) => {
        state.list = [];
        state.selected = null;
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllQuestions.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = 'succeeded';
        })
        .addCase(getQuestionById.fulfilled, (state, action) => {
          state.selected = action.payload;
          state.status = 'succeeded';
        })
        .addCase(getQuestionsByEventId.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = 'succeeded';
        })
        .addCase(getQuestionsByTherapySessionId.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = 'succeeded';
        })

        .addCase(getQuestionsBySpecialistId.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = 'succeeded';
        })
        .addCase(createQuestionForEvent.fulfilled, (state, action) => {
          state.list.push(action.payload);
          state.status = 'succeeded';
        })
        .addCase(createQuestionForTherapySession.fulfilled, (state, action) => {
          state.list.push(action.payload);
          state.status = 'succeeded';
        })
        .addCase(updateQuestion.fulfilled, (state, action) => {
          const index = state.list.findIndex(q => q.id === action.payload.id);
          if (index !== -1) state.list[index] = action.payload;
          state.status = 'succeeded';
        })
        .addCase(deleteQuestion.fulfilled, (state, action) => {
          state.list = state.list.filter(q => q.id !== action.payload);
          state.status = 'succeeded';
        })
        .addMatcher(
          (action) => action.type.startsWith('questions/') && action.type.endsWith('/pending'),
          (state) => {
            state.status = 'loading';
            state.error = null;
          }
        )
        .addMatcher(
          (action) => action.type.startsWith('questions/') && action.type.endsWith('/rejected'),
          (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          }
        );
    },
  });
  
export const { resetQuestions } = questionSlice.actions;
export default questionSlice.reducer;