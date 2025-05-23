import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CustomDropdown2 from "../components/CustomDropdown2";
import { fetchRecommendations } from '../features/recommendation/recommendationSlice';
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeByUserId, updateEmployee } from "../features/employee/employeeSlice";
import { getTherapistById } from "../features/therapists/therapistsSlice";
import TherapistCard from "../components/TherapistCard/TherapistCard";
import CalculatingAnimation from "../components/CalculatingAnimation";

function CompatibilityForm() {
    const [showResults, setShowResults] = useState(false);
    const [therapistCards, setTherapistCards] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const recommendations = useSelector(state => state.recommendation);

    console.log("user: ", user);
    console.log("employee: ", employee);
    console.log(recommendations);

    useEffect(() => {
        dispatch(getEmployeeByUserId(user?.id))
    }, [dispatch, user?.id]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedEmployee = {
            userId: employee.userId,
            hireDate: employee.hireDate,
            allowAnonymous: employee.allowAnonymous,
            isManager: employee.isManager,
            department: employee.department,
            preferredGender: form.preferredGender,
            preferredMinAge: form.preferredMinAge || null,
            preferredMaxAge: form.preferredMaxAge || null,
            preferredFormation: form.preferredFormation,
            preferredSpecialization: form.preferredSpecialization,
            preferredTherapyStyle: form.preferredTherapyStyle,
        };

        try {
            setShowResults(false);
            setIsLoadingRecommendations(true);

            await dispatch(updateEmployee({ id: employee.id, employee: updatedEmployee })).unwrap();

            const response = await dispatch(fetchRecommendations(employee.id)).unwrap();

            const scoresWithPercentage = response.map(r => ({
                specialistId: r.specialistId,
                score: r.score,
                compatibility: Math.round((r.score / 5) * 100)
            }));

            const therapists = await Promise.all(
                scoresWithPercentage.map(async ({ specialistId, compatibility }) => {
                    const res = await dispatch(getTherapistById(specialistId)).unwrap();
                    return {
                        therapist: res,
                        compatibility
                    };
                })
            );

            setTherapistCards(therapists);

            setTimeout(() => {
                setIsLoadingRecommendations(false);
                setShowResults(true);
            }, 1000);

        } catch (err) {
            console.error("Eroare in handleSubmit:", err);
            setIsLoadingRecommendations(false);
        }
    };



    const genderOptions = [
        { label: "Nicio preferinta", value: "" },
        { label: "Feminin", value: "feminin" },
        { label: "Masculin", value: "masculin" },
        { label: "Altul", value: "altul" }
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

            {!showResults && !isLoadingRecommendations &&
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
            }

            {isLoadingRecommendations && (

                <CalculatingAnimation
                    duration={4000}
                    onComplete={() => {

                    }}
                />

            )}


            {!isLoadingRecommendations && showResults &&
                <div className="flex flex-col gap-4">
                    <h1
                        className="mt-12  text-center text-5xl font-extrabold bg-gradient-to-r from-[#ec4899] via-[#7c3aed] to-[#4f46e5] text-transparent bg-clip-text leading-tight"
                        style={{
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                            fontFamily: "'Poppins', sans-serif"
                        }}
                    >
                        Iată terapeuții recomandați pentru tine!
                    </h1>

                    <div className="flex flex-wrap justify-center gap-14 px-10 mt-10">
                        {therapistCards.map(({ therapist, compatibility }) => (
                            <div
                                key={therapist.id}
                                className="w-[450px] flex flex-col items-center"
                            >
                                <TherapistCard therapist={therapist} />

                                <div className="w-4/5 mt-10 flex flex-col items-center">
                                    <div className="relative w-48 h-8 rounded-xl bg-gray-200 border border-[#ec4899] overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full rounded-xl bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#ec4899] transition-all duration-700"
                                            style={{ width: `${compatibility}%` }}
                                        ></div>
                                        <div className="absolute w-full h-full flex items-center justify-center z-10">
                                            <span className="text-white font-semibold text-sm drop-shadow-sm">
                                                {compatibility}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* to do: back de pe details tre sa ma intoarca la formular fara sa dispara terapeutii */}

                </div>

            }

        </div>
    )
}

export default CompatibilityForm;