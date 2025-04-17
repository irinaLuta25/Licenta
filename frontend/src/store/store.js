import { configureStore } from "@reduxjs/toolkit";
import therapistsReducer from "../features/therapists/therapistsSlice"
import authReducer from '../features/auth/authSlice'
import therapySessionsReducer from "../features/therapySessions/therapySessionsSlice"
import employeeReducer from "../features/employee/employeeSlice";
import intervalReducer from "../features/interval/intervalSlice"
import eventSlice from "../features/event/eventSlice"
import employeeEventSlice from "../features/employeeEvent/employeeEventSlice"
import userReducer from "../features/user/userSlice"; 

export const store = configureStore({
    reducer: {
        auth: authReducer,
        therapists: therapistsReducer,
        therapySessions: therapySessionsReducer,
        employee: employeeReducer,
        interval: intervalReducer,
        event: eventSlice,
        employeeEvent: employeeEventSlice,
        user: userReducer
    }
})