import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import { Navigate } from "react-router-dom";
import TherapistDetails from "./pages/Therapists/TherapistDetails";
import Events from "./pages/Events";
import EmployeeSchedule from "./pages/EmployeeSchedule";
import FeedbackForm from "./pages/FeedbackForm";
import CompatibilityForm from "./pages/CompatibilityForm";
import HomepageEmployee from "./pages/HomepageEmployee";
import Wellbeing from "./pages/Wellbeing";
import { useSelector } from "react-redux";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";



function MainEmployee() {
    const employee = useSelector((state) => state.employee.employee);

    return(
        <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="therapists/:id" element={<TherapistDetails />} />
            <Route path="events" element={<Events />} />
            <Route path="schedule" element={<EmployeeSchedule />} />
            <Route path="schedule/event/:id" element={<FeedbackForm />} />
            <Route path="schedule/therapySession/:id" element={<FeedbackForm />} />
            <Route path="therapists/compatibilityForm" element={<CompatibilityForm />} />
            <Route path="home" element={<HomepageEmployee />} />
            <Route path="wellbeing" element={<Wellbeing />} />
            <Route path="profile" element={<Profile />} /> 
            
            <Route path="reports" element={<Reports />} />
        </Routes>
    )
    
}

export default MainEmployee