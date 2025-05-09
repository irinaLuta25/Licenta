import React from "react";
import LoginCard from "../../components/LoginCard/LoginCard";

function Login() {
    return (
        <div
  className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/background.png')" }}
>
  <LoginCard />
</div>

    );
}

export default Login;
