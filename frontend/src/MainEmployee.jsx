import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Therapists from "./pages/Login/Therapists/Therapists";
import { Navigate } from "react-router-dom";

function MainEmployee() {

    return(
        <Routes>
            {/* pages in navbar: therapists, events, habits, profile */}
            {/* daca isManager==true => si pagina de reports */}
            <Route path="/" element={<Navigate to="therapists" />} />
            <Route path="therapists" element={<Therapists />} />
        </Routes>
    )
    
}

export default MainEmployee