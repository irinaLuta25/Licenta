import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import { Navigate } from "react-router-dom";
import TherapistDetails from "./pages/Therapists/TherapistDetails";
import Events from "./pages/Events";

function MainEmployee() {

    return(
        <Routes>
            {/* pages in navbar: therapists, events, habits, profile */}
            {/* daca isManager==true => si pagina de reports */}
            <Route path="/" element={<Navigate to="therapists" />} />
            <Route path="therapists" element={<Therapists />} />
            <Route path="therapists/:id" element={<TherapistDetails />} />
            <Route path="events" element={<Events />} />
        </Routes>
    )
    
}

export default MainEmployee