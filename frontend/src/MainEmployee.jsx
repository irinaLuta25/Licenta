import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import { Navigate } from "react-router-dom";
import TherapistDetails from "./pages/Therapists/TherapistDetails";
import Events from "./pages/Events";
import EmployeeSchedule from "./pages/EmployeeSchedule";
import FeedbackForm from "./pages/FeedbackForm";
// import { useSelector } from "react-redux";



function MainEmployee() {
    // const employee = useSelector((state) => state.employee.employee);

    return(
        <Routes>
            {/* pages in navbar: therapists, events, habits, profile */}
            {/* daca isManager==true => si pagina de reports */}
            <Route path="/" element={<Navigate to="therapists" />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="therapists/:id" element={<TherapistDetails />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<EmployeeSchedule />} />
            <Route path="schedule/event/:id" element={<FeedbackForm />} />
            <Route path="schedule/therapySession/:id" element={<FeedbackForm />} />
            {/* <Route path="calendar" element={<CalendarEmployee />} />
            <Route path="profile" element={<Profile />} />
            <Route path="habits" element={<Habits />} />
            {employee?.isManager && <Route path="reports" element={<Reports />} />} */}
        </Routes>
    )
    
}

export default MainEmployee