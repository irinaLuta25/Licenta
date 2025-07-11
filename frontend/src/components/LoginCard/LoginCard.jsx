import { React, useState, useRef } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getUserFromCookie } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import CustomDropdown2 from "../CustomDropdown2";
import { FiUpload } from "react-icons/fi";

function LoginCard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthdate: "",
    gender: "feminin",
    password: "",
    role: "angajat",
    department: "HR",
    hireDate: "",
    allowAnonymous: false,
    description: "",
    linkedin: "",
    facebook: "",
    website: "",
    isTherapist: false,
    formation: "",
    specialization: "",
    therapyStyle: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateStepOne = () => {
    const fields = ["firstName", "lastName", "phoneNumber", "birthdate", "gender", "role", "email", "password"];
    for (let f of fields) {
      if (!form[f] || form[f] === "") {
        toast.warning("Toate câmpurile sunt obligatorii.")
        return false;
      }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Email invalid");
      return false;
    }

    const phoneNumberRegex = /^[0-9\s\-().+]{10,20}$/;
    if (!phoneNumberRegex.test(form.phoneNumber)) {
      toast.error("Număr de telefon invalid.");
      return false;
    }

    const nameRegex = /^[a-zA-ZÀ-ž\s.'-]{2,}$/;
    if (!nameRegex.test(form.firstName)) {
      toast.error("Prenume invalid.");
      return false;
    }

    if (!nameRegex.test(form.lastName)) {
      toast.error("Nume de familie invalid.");
      return false;
    }

    return true;
  };

  const validateStepTwo = () => {
    if (form.role === "angajat") {
      return form.department && form.hireDate;
    } else {
      if (!form.description) return false;
      if (form.isTherapist && (!form.formation || !form.specialization || !form.therapyStyle)) return false;
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form values:", form);

    if (!isLogin && step === 2 && !validateStepTwo()) {
      return;
    }


    try {
      if (isLogin) {
        const response = await axios.post("/user/login", {
          email: form.email,
          password: form.password,
        });
      } else {
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
          if (val !== null && val !== "") {
            formData.append(key, val);
          }
        });

        await axios.post("/user/register", formData);
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

  const genderOptions = [
    { label: "Feminin", value: "feminin" },
    { label: "Masculin", value: "masculin" },
    { label: "Altul", value: "altul" },
  ];

  const roleOptions = [
    { label: "Angajat", value: "angajat" },
    { label: "Specialist", value: "specialist" },
  ];

  const departmentOptions = [
    { label: "Resurse Umane", value: "Resurse Umane" },
    { label: "IT", value: "IT" },
    { label: "Marketing", value: "Marketing" },
    { label: "Financiar", value: "Financiar" },
  ];

  const formationOptions = [
    { label: "CBT", value: "CBT" },
    { label: "Psihanaliza", value: "Psihanaliza" },
    { label: "Sistemica", value: "Sistemica" },
    { label: "Experientiala", value: "Experientiala" },
  ];

  const specializationOptions = [
    { label: "Adictii", value: "Adictii" },
    { label: "Tulburări de anxietate și depresie", value: "Tulburări de anxietate și depresie" },
    { label: "Traumă și abuz", value: "Traumă și abuz" },
    { label: "Burnout", value: "Burnout" },
  ];

  const therapyStyleOptions = [
    { label: "Directiv", value: "Directiv" },
    { label: "Non-Directiv", value: "Non-Directiv" },
    { label: "Empatic", value: "Empatic" },
    { label: "Explorator", value: "Explorator" },
    { label: "Orientat pe obiective", value: "Orientat pe obiective" },
  ];

  const UploadProfileImage = () => (
    <div
      className="relative border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center bg-white/50 text-sm text-gray-700 cursor-pointer hover:bg-white/70 transition-all duration-200"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current.click()}
    >
      <div className="flex flex-col items-center space-y-2">
        <FiUpload className="text-4xl text-indigo-500" />

        <p className="font-semibold text-indigo-700">Trage o imagine aici</p>
        <p className="text-gray-600 text-sm">sau fă clic pentru a selecta un fișier (max. 4MB)</p>

        {form.profileImage && (
          <p className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
            Fișier selectat: {form.profileImage.name}
          </p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        name="profileImage"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );



  const renderStepOne = () => (
    <>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner"
      />
      <input
        type="password"
        name="password"
        placeholder="Parolă"
        value={form.password}
        onChange={handleChange}
        className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner"
      />
      <input type="text" name="firstName" placeholder="Prenume" value={form.firstName} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
      <input type="text" name="lastName" placeholder="Nume" value={form.lastName} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
      <input type="tel" name="phoneNumber" placeholder="Număr de telefon" value={form.phoneNumber} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
      <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 focus:outline-none shadow-inner" />
      <CustomDropdown2 value={form.gender} onChange={(val) => setForm(prev => ({ ...prev, gender: val }))} options={genderOptions} />
      <CustomDropdown2 value={form.role} onChange={(val) => setForm(prev => ({ ...prev, role: val }))} options={roleOptions} />
    </>
  );

  const renderStepTwo = () => {
    const commonFields = (
      <>
        <UploadProfileImage />
      </>
    );

    if (form.role === "angajat") {
      return (
        <>
          <CustomDropdown2 value={form.department} onChange={(val) => setForm(prev => ({ ...prev, department: val }))} options={departmentOptions} />
          <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 focus:outline-none shadow-inner" />
          {commonFields}
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" name="allowAnonymous" checked={form.allowAnonymous} onChange={handleChange} className="accent-indigo-600 mt-1" />
            <span className="text-sm">Permiți prelucrarea anonimă a datelor tale în scopul analizei interne și al îmbunătățirii serviciilor oferite?</span>
          </label>
        </>
      );
    } else {
      return (
        <>
          <textarea name="description" placeholder="Descriere profesională" value={form.description} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
          <input type="text" name="linkedin" placeholder="Profil LinkedIn" value={form.linkedin} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
          <input type="text" name="facebook" placeholder="Profil Facebook" value={form.facebook} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
          <input type="text" name="website" placeholder="Website personal" value={form.website} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
          {commonFields}
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input type="checkbox" name="isTherapist" checked={form.isTherapist} onChange={handleChange} className="accent-indigo-600 mt-1" />
            <span className="text-sm">Practici psihoterapia?</span>
          </label>
          {form.isTherapist && (
            <>
              <CustomDropdown2 value={form.formation} onChange={(val) => setForm(prev => ({ ...prev, formation: val }))} options={formationOptions} />
              <CustomDropdown2 value={form.specialization} onChange={(val) => setForm(prev => ({ ...prev, specialization: val }))} options={specializationOptions} />
              <CustomDropdown2 value={form.therapyStyle} onChange={(val) => setForm(prev => ({ ...prev, therapyStyle: val }))} options={therapyStyleOptions} />
            </>
          )}
        </>
      );
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center px-4">
      <div className="z-10 w-full max-w-md px-11 py-7 rounded-[30px] backdrop-blur-[12px] bg-white/10 border border-[#77B0AA] shadow-[0_0_20px_rgba(119,176,170,0.6)] animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-800 mb-5 text-center">
          {isLogin ? "Autentificare" : "Înregistrare"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {isLogin ? (
            <>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
              <input type="password" name="password" placeholder="Parolă" value={form.password} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" />
              <button type="submit" className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-lg text-sm">
                Autentifică-te
              </button>
            </>
          ) : (
            <>
              {step === 1 && renderStepOne()}
              {step === 2 && renderStepTwo()}

              <div className="flex gap-2">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2.5 rounded-xl transition duration-200 shadow-lg text-sm"
                  >
                    Înapoi
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!validateStepOne()) {
                        return;
                      }
                      console.log("Step 1 values:", form);
                      setStep(2);
                    }}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-lg text-sm"
                  >
                    Următorul
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2.5 rounded-xl transition duration-200 shadow-lg text-sm"
                  >
                    Înregistrează-te
                  </button>
                )}
              </div>
            </>
          )}
        </form>

        <p className="mt-5 text-center text-sm text-indigo-900">
          {isLogin ? "Nu ai un cont?" : "Ai deja un cont?"} {" "}
          <span className="text-indigo-700 font-medium hover:underline cursor-pointer" onClick={() => { setIsLogin(!isLogin); setStep(1); }}>
            {isLogin ? "Înregistrează-te" : "Autentifică-te"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginCard;
