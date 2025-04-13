import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Therapists/Therapists";
import { Navigate } from "react-router-dom";


function MainSpecialist() {

    return(
        <Routes>
            {/* pages in navbar: clients, events, calendar, profile */}
            <Route path="/" element={<Navigate to="therapists" />} />
            <Route path="therapists" element={<Therapists />} />

        </Routes>
    )
    
}

export default MainSpecialist