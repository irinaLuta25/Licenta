import React from "react"; 
import "./Login.css";
import "../../components/LoginCard/LoginCard"
import LoginCard from "../../components/LoginCard/LoginCard";

function Login() {
    return(
        <div className="login-container">
            <LoginCard/>
        </div>
    )
}

export default Login;