import { configureStore } from "@reduxjs/toolkit";
import therapistsReducer from "../features/therapists/therapistsSlice"
import authReducer from '../features/auth/authSlice'
import therapySessionsReducer from "../features/therapySessions/therapySessionsSlice"
import employeeReducer from "../features/employee/employeeSlice";
import intervalReducer from "../features/interval/intervalSlice"
import eventSlice from "../features/event/eventSlice"
import employeeEventSlice from "../features/employeeEvent/employeeEventSlice"
import userReducer from "../features/user/userSlice";
import questionReducer from "../features/question/questionSlice"
import answerReducer from "../features/answer/answerSlice"
import recommendationReducer from '../features/recommendation/recommendationSlice';
import habitTrackingReducer from "../features/habitTracking/habitTrackingSlice";
import employeeGoalsReducer from "../features/employeeGoals/employeeGoalSlice";
import habitReducer from "../features/habit/habitSlice";
import employeeRewardReducer from "../features/employeeReward/employeeRewardSlice"
import rewardReducer from "../features/reward/rewardSlice"
import emotionalStateReducer from "../features/emotionalState/emotionalStateSlice"
import reportsReducer from "../features/reports/reportsSlice"
import problemReducer from "../features/problem/problemSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        therapists: therapistsReducer,
        therapySessions: therapySessionsReducer,
        employee: employeeReducer,
        interval: intervalReducer,
        event: eventSlice,
        employeeEvent: employeeEventSlice,
        user: userReducer,
        question: questionReducer,
        answer: answerReducer,
        recommendation: recommendationReducer,
        habitTracking: habitTrackingReducer,
        employeeGoals: employeeGoalsReducer,
        habit: habitReducer,
        employeeReward: employeeRewardReducer,
        reward: rewardReducer,
        emotionalState: emotionalStateReducer,
        reports: reportsReducer,
        problem: problemReducer
    }
})