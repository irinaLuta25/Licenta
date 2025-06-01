import { React, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getUserFromCookie } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import CustomDropdown2 from "../CustomDropdown2";

function LoginCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
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
        toast.success("Cont creat cu succes!");
      }

      await dispatch(getUserFromCookie());
      navigate('/');
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || "Eroare la autentificare/înregistrare";
      toast.error(message);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4">
      <div className="z-10 w-full max-w-md px-11 py-7 rounded-[30px] backdrop-blur-[12px] bg-white/10 border border-[#77B0AA] shadow-[0_0_20px_rgba(119,176,170,0.6)] animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-800 mb-5 text-center">
          {isLogin ? "Autentificare" : "Înregistrare"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {!isLogin && (
            <>
              <input type="text" name="firstName" placeholder="Prenume" value={form.firstName} onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
              <input type="text" name="lastName" placeholder="Nume" value={form.lastName} onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
              <input type="tel" name="phoneNumber" placeholder="Număr de telefon" value={form.phoneNumber} onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
              <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 focus:outline-none shadow-inner" />

              <CustomDropdown2
                value={form.gender}
                onChange={(val) => setForm(prev => ({ ...prev, gender: val }))}
                options={[
                  { label: "Gen", value: "" },
                  { label: "Feminin", value: "feminin" },
                  { label: "Masculin", value: "masculin" },
                  { label: "Altul", value: "altul" },
                ]}
              />

              <CustomDropdown2
                value={form.role}
                onChange={(val) => setForm(prev => ({ ...prev, role: val }))}
                options={[
                  { label: "Angajat", value: "angajat" },
                  { label: "Specialist", value: "specialist" },
                ]}
              />
            </>
          )}

          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
          <input type="password" name="password" placeholder="Parolă" value={form.password} onChange={handleChange}
            className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />

          <button type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-lg text-sm">
            {isLogin ? "Autentifică-te" : "Înregistrează-te"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-indigo-900">
          {isLogin ? "Nu ai un cont?" : "Ai deja un cont?"}{" "}
          <span
            className="text-indigo-700 font-medium hover:underline cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ?  "Înregistrează-te" : "Autentifică-te"}
          </span>
        </p>
      </div>
    </div>


  );
}

export default LoginCard;
