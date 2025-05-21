import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import CustomDropdown2 from "../components/CustomDropdown2";
import { fetchRecommendations } from '../features/recommendation/recommendationSlice';
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeByUserId, updateEmployee } from "../features/employee/employeeSlice";
import { getTherapistById } from "../features/therapists/therapistsSlice";
import TherapistCard from "../components/TherapistCard/TherapistCard";


function CompatibilityForm() {
    const [showResults, setShowResults] = useState(false);
    const [therapistCards, setTherapistCards] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const recommendations = useSelector(state => state.recommendation);

    console.log("user: ", user);
    console.log("employee: ", employee);
    console.log(recommendations);

    useEffect(() => {
        if (recommendations.data && recommendations.data.length > 0) {

            const scoresWithPercentage = recommendations.data.map(r => ({
                specialistId: r.specialistId,
                score: r.score,
                compatibility: Math.round((r.score / 5) * 100)
            }));

            console.log(scoresWithPercentage);

            Promise.all(
                scoresWithPercentage.map(async ({ specialistId, compatibility }) => {
                    const res = await dispatch(getTherapistById(specialistId)).unwrap();
                    return {
                        therapist: res,
                        compatibility
                    };
                })
            ).then(setTherapistCards);

        }
    }, [dispatch, recommendations.data]);


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

        // update employee
        const updatedEmployee = {
            userId: employee.userId,
            hireDate: employee.hireDate,
            allowAnonymous: employee.allowAnonymous,
            isManager: employee.isManager,
            department: employee.department,
            preferredGender: form.preferredGender,
            preferredMinAge: form.preferredMinAge,
            preferredMaxAge: form.preferredMaxAge,
            preferredFormation: form.preferredFormation,
            preferredSpecialization: form.preferredSpecialization,
            preferredTherapyStyle: form.preferredTherapyStyle,
        }

        console.log("user id:", employee.userId)
        dispatch(updateEmployee({ id: employee.id, employee: updatedEmployee }));

        // apar cartonase
        setShowResults(true);
        console.log(showResults);


        console.log("Form submitted:", form);
        // !!          to do: ceva animatie chestie inainte sa apara terapeutii care sa apara cateva secunde ceva gen se cauta lalala
        //                  stilizeaza procente si titlu 
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

            {!showResults &&
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

            {showResults &&
                <div className="flex flex-col gap-4">
                    <h2 className="text-center text-2xl font-bold text-indigo-800 mt-6">Iata cei 3 terapeuti</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 px-10 mt-10">
                        {therapistCards.map(({ therapist, compatibility }) => (
                            <div key={therapist.id} className="flex flex-col items-center">
                                <TherapistCard therapist={therapist} />

                                <div className="w-4/5 mt-10 flex flex-col items-center">
                                {/* proc pe bara! + border, poate gradient cu indigo sau alte culori */}
                                {/* back de pe details tre sa ma intoarca la formular fara sa dispara terapeutii */}
                                {/* daca apasa programeaza te pe details => intoarcere in therapists */}
                                    <div className="w-48 bg-indigo-200 rounded-xl h-8">
                                        <div
                                            className={`h-8 rounded-xl transition-all duration-700 bg-indigo-700`}
                                            style={{ width: `${compatibility}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-center text-sm mt-1 font-semibold text-indigo-900">
                                        Compatibilitate: {compatibility}%
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

            }

        </div>
    )
}

export default CompatibilityForm;