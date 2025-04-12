import {React,useState} from "react";
import "./LoginCard.css";
import axios from "axios";

import { useDispatch } from 'react-redux';
import { getUserFromCookie } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';


function LoginCard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [isLogin, setIsLogin] = useState(true); // login sau register
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        birthdate: "",
        gender: "",
        password: "",
        role: "angajat",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // login
                await axios.post("/user/login", {
                    email: form.email,
                    password: form.password,
                });
                alert("Login success!");
            } else {
                // register
                await axios.post("/user/register", form);
                alert("Register success!");
            }

            await dispatch(getUserFromCookie());
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Eroare la register/login");
        }
    };

    return (
        <div className="login-card">
            <h2>{isLogin ? "Autentificare" : "Înregistrare"}</h2>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <input type="text" name="firstName" placeholder="Prenume" value={form.firstName} onChange={handleChange} required />
                        <input type="text" name="lastName" placeholder="Nume" value={form.lastName} onChange={handleChange} required />
                        <input type="tel" name="phoneNumber" placeholder="Telefon" value={form.phoneNumber} onChange={handleChange} required />
                        <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} required />

                        <select name="gender" value={form.gender} onChange={handleChange} required>
                            <option value="">Gen</option>
                            <option value="feminin">Feminin</option>
                            <option value="masculin">Masculin</option>
                            <option value="altul">Altul</option>
                        </select>

                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="angajat">Angajat</option>
                            <option value="specialist">Specialist</option>
                        </select>
                    </>
                )}

                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Parolă" value={form.password} onChange={handleChange} required />

                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>

            <p style={{ marginTop: "15px" }}>
                {isLogin ? "Nu ai cont?" : "Ai deja cont?"}{" "}
                <span
                    style={{ color: "#007bff", cursor: "pointer" }}
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Register" : "Login"}
                </span>
            </p>
        </div>
    )
}

export default LoginCard;