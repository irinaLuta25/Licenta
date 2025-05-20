import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CustomDropdown2 from "../components/CustomDropdown2";
import { fetchRecommendations } from '../features/recommendation/recommendationSlice';
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";


// plan:
// - vezi word intrebari
// - se da update la employee cu raspunsurile la intrebari
// - se da update la therapySession pt satisfactionScore
// - dispare formular, apar recomandarile cele 3 cu procentele si un text sugestiv


function CompatibilityForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const recommendations = useSelector(state => state.recommendation);

    console.log("user: ", user);
    console.log("employee: ", employee);
    console.log(recommendations);

    if (recommendations.data) {

        const scoresWithPercentage = recommendations.data.map(r => ({
            specialistId: r.specialistId,
            score: r.score,
            compatibility: Math.round((r.score / 5) * 100)
        }));

        console.log(scoresWithPercentage);
    }



    useEffect(() => {
        dispatch(getEmployeeByUserId(user?.id))
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (employee?.id) {
            dispatch(fetchRecommendations(employee.id));
        }
    }, [dispatch, employee?.id]);

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
        { label: "Nicio preferinta", value: "" },
        { label: "Feminin", value: "feminin" },
        { label: "Masculin", value: "masculin" },
        { label: "AlLtul", value: "altul" }
    ];

    const formationOptions = [
        { label: "Nicio preferinta", value: "" },
        { label: "CBT", value: "CBT" },
        { label: "Psihanaliza", value: "Psihanaliza" },
        { label: "Sistemica", value: "Sistemica" },
        { label: "Experientiala", value: "Experientiala" }
    ];

    // de schimbat candva si integrat in ML - doar daca fac sa poata avea o singura specializare
    const specializationOptions = [
        { label: "Nicio preferinta", value: "" },
        { label: "Anxiety", value: "Anxiety" },
        { label: "Depression", value: "Depression" },
        { label: "Trauma", value: "Trauma" },
        { label: "Burnout", value: "Burnout" }
    ];

    const therapyStyleOptions = [
        { label: "Nicio preferinta", value: "" },
        { label: "Directiv", value: "Directiv" },
        { label: "Non-Directiv", value: "Non-Directiv" },
        { label: "Empatic", value: "Empatic" },
        { label: "Explorator", value: "Explorator" },
        { label: "Orientat pe obiective", value: "Orientat pe obiective" }
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
                    <h2 className="text-center text-2xl font-bold text-indigo-800 mb-6">Haide să găsim terapeutul potrivit pentru tine!</h2>

                    <label className="block mb-2 font-semibold text-indigo-800">Preferință gen</label>
                    <CustomDropdown2
                        value={form.preferredGender}
                        onChange={(val) => setForm({ ...form, preferredGender: val })}
                        options={genderOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferință vârstă</label>
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

                    <label className="block mb-2 font-semibold text-indigo-800">Preferință formare</label>
                    <CustomDropdown2
                        value={form.preferredFormation}
                        onChange={(val) => setForm({ ...form, preferredFormation: val })}
                        options={formationOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferință specializare</label>
                    <CustomDropdown2
                        value={form.preferredSpecialization}
                        onChange={(val) => setForm({ ...form, preferredSpecialization: val })}
                        options={specializationOptions}
                    />

                    <label className="block mt-6 mb-2 font-semibold text-indigo-800">Preferință stil terapeutic</label>
                    <CustomDropdown2
                        value={form.preferredTherapyStyle}
                        onChange={(val) => setForm({ ...form, preferredTherapyStyle: val })}
                        options={therapyStyleOptions}
                    />

                    <button
                        type="submit"
                        className="w-full mt-8 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded"
                    >
                        Trimite
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CompatibilityForm;