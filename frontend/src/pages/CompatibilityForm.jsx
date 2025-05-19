import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CustomDropdown2 from "../components/CustomDropdown2";

// plan:
// - vezi word intrebari
// - se da update la employee cu raspunsurile la intrebari
// 


function CompatibilityForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        preferredGender: "",
        preferredMinAge: "",
        preferredMaxAge: "",
        preferredFormation: "",
        preferredSpecialization: "",
        preferredTherapyStyle: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { preferredMinAge, preferredMaxAge } = form;

        console.log("Form submitted:", form);
        // TODO: Send form data to backend to update employee
        //          cartonas cu ceva animatie cu se calculeaza compatibilitatea si procente turbate (optional)
        //          alternativ: alerta sau text cu succes! uite terapeutii
        //          ! setez un showResults=true si cand e true sa dispara formular si sa apara cele 3 match-uri
        //          in cartonasele care apar si pe therapists dar avand si un procent de compatibilitate 
        //          idee: poti lasa deasupra cardului sau sub card procentul ca sa reciclezi doar TherapistCard direct
    };

    const genderOptions = [
        { label: "No preference", value: "" },
        { label: "Female", value: "Female" },
        { label: "Male", value: "Male" },
        { label: "Other", value: "Other" }
    ];

    const formationOptions = [
        { label: "No preference", value: "" },
        { label: "CBT", value: "CBT" },
        { label: "Gestalt", value: "Gestalt" },
        { label: "Psychodynamic", value: "Psychodynamic" },
        { label: "Integrative", value: "Integrative" }
    ];

    const specializationOptions = [
        { label: "No preference", value: "" },
        { label: "Anxiety", value: "Anxiety" },
        { label: "Depression", value: "Depression" },
        { label: "Trauma", value: "Trauma" },
        { label: "Burnout", value: "Burnout" }
    ];

    const therapyStyleOptions = [
        { label: "No preference", value: "" },
        { label: "Supportive", value: "Supportive" },
        { label: "Directive", value: "Directive" },
        { label: "Exploratory", value: "Exploratory" },
        { label: "Coaching-style", value: "Coaching-style" }
    ];

    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <div className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <button onClick={() => navigate(-1)} className="text-2xl font-bold hover:underline">
                    ← Back
                </button>
            </div>

            <div className="flex justify-center items-center mt-10">
                <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-xl hover:shadow-2xl border border-indigo-300/30 drop-shadow-lg rounded-2xl p-8 w-full max-w-xl"
                >
                    <h2 className="text-center text-2xl font-bold text-indigo-800 mb-6">Let us find compatible therapists for you!</h2>

                    <label className="block mb-2 font-semibold text-indigo-800">Preferred Gender</label>
                    <CustomDropdown2
                        value={form.preferredGender}
                        onChange={(val) => setForm({ ...form, preferredGender: val })}
                        options={genderOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferred Age Range</label>
                    <div className="flex gap-4 mb-4">
                        <input
                            type="number"
                            name="preferredMinAge"
                            value={form.preferredMinAge}
                            onChange={handleChange}
                            placeholder="Min Age"
                            min={18}
                            className="w-1/2 p-2 rounded bg-white bg-opacity-70 text-indigo-900"
                        />
                        <input
                            type="number"
                            name="preferredMaxAge"
                            value={form.preferredMaxAge}
                            onChange={handleChange}
                            placeholder="Max Age"
                            max={90}
                            className="w-1/2 p-2 rounded bg-white bg-opacity-70 text-indigo-900"
                        />
                    </div>

                    <label className="block mb-2 font-semibold text-indigo-800">Preferred Formation</label>
                    <CustomDropdown2
                        value={form.preferredFormation}
                        onChange={(val) => setForm({ ...form, preferredFormation: val })}
                        options={formationOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferred Specialization</label>
                    <CustomDropdown2
                        value={form.preferredSpecialization}
                        onChange={(val) => setForm({ ...form, preferredSpecialization: val })}
                        options={specializationOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferred Therapy Style</label>
                    <CustomDropdown2
                        value={form.preferredTherapyStyle}
                        onChange={(val) => setForm({ ...form, preferredTherapyStyle: val })}
                        options={therapyStyleOptions}
                    />

                    <button
                        type="submit"
                        className="w-full mt-8 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded"
                    >
                        Submit Preferences
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompatibilityForm;