import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllAnswersByQuestionId = createAsyncThunk(
    'answers/getByQuestionId',
    async ({questionId}, { rejectWithValue }) => {
      try {
        const res = await axios.get(`/answer/getAllAnswersByQuestionId/${questionId}`);
        return res.data;
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
    },
    reducers: {
      
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllAnswersByQuestionId.fulfilled, (state, action) => {
          state.list = action.payload;
          state.status = 'succeeded';
        })
        
    },
  });
  
export default answerSlice.reducer;