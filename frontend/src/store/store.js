import { configureStore } from "@reduxjs/toolkit";
import therapistsReducer from "../features/therapists/therapistsSlice"
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        therapists: therapistsReducer
    }
})