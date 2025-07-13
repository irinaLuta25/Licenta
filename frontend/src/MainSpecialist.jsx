import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import { Navigate } from "react-router-dom";
import TherapistDetails from "./pages/Therapists/TherapistDetails";
import SpecialistSchedule from "./pages/SpecialistSchedule";
import Clients from "./pages/Clients";
import HomepageSpecialist from "./pages/HomepageSpecialist";
import Profile from "./pages/Profile";


function MainSpecialist() {

    return (
        <Routes>
            <Route path="/" element={<Navigate to="home" />} />
            <Route path="events" element={<Events />} />
            <Route path="events/create-event" element={<CreateEvent />} />
            <Route path="schedule" element={<SpecialistSchedule />} />
            <Route path="clients" element={<Clients />} />
            <Route path="home" element={<HomepageSpecialist />} />
            <Route path="profile" element={<Profile />} />

        </Routes>
    )

}

export default MainSpecialist