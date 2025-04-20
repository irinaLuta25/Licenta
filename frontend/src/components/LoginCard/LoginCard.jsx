import { React, useState } from "react";
import "./LoginCard.css";
import axios from "axios";
import { toast } from 'react-toastify';

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
        const requiredFields = isLogin
            ? ["email", "password"]
            : ["firstName", "lastName", "email", "phoneNumber", "birthdate", "gender", "password"];

        for (let field of requiredFields) {
            if (!form[field]) {
                toast.error("Te rugăm să completezi toate câmpurile.");
                return;
            }
        }

        try {
            if (isLogin) {
                await axios.post("/user/login", {
                    email: form.email,
                    password: form.password,
                });
            } else {
                await axios.post("/user/register", form);
                toast.success("Cont creat cu succes! 🎉")
            }

            await dispatch(getUserFromCookie());
            navigate('/');
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.message || "Eroare la register/login";
            toast.error(message);
        }
    };

    return (
        <div className="login-card">
            <h2>{isLogin ? "Autentificare" : "Înregistrare"}</h2>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <>
                        <input type="text" name="firstName" placeholder="Prenume" value={form.firstName} onChange={handleChange}  />
                        <input type="text" name="lastName" placeholder="Nume" value={form.lastName} onChange={handleChange}  />
                        <input type="tel" name="phoneNumber" placeholder="Telefon" value={form.phoneNumber} onChange={handleChange}  />
                        <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange}  />

                        <select name="gender" value={form.gender} onChange={handleChange} >
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

                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}  />
                <input type="password" name="password" placeholder="Parolă" value={form.password} onChange={handleChange}  />

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