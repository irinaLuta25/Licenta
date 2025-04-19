import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import { Navigate } from "react-router-dom";
import TherapistDetails from "./pages/Therapists/TherapistDetails";


function MainSpecialist() {

    return(
        <Routes>
            {/* pages in navbar: clients, events, calendar, profile */}
            <Route path="/" element={<Navigate to="therapists" />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="therapists/:id" element={<TherapistDetails />} />
            <Route path="events" element={<Events />}/>
            <Route path="events/create-event" element={<CreateEvent />} />
            {/* <Route path="calendar" element={<CalendarSpecialist />} />
            <Route path="profile" element={<Profile />} /> 
            <Route path="clients" element={<Clients />} /> 
            */}

        </Routes>
    )
    
}

export default MainSpecialist