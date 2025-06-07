import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MoodEvolutionChart from "../components/Charts/MoodEvolutionChart";
import MoodFrequencyChart from "../components/Charts/MoodFrequencyChart";
import { useDispatch, useSelector } from "react-redux";
import ProblemEvolutionChart from "../components/Charts/ProblemEvolutionChart";
import EventTypeChart from "../components/Charts/EventTypeChart";
import TherapySatisfactionChart from "../components/Charts/TherapySatisfactionChart";
import ProblemsList from "../components/ProblemsList";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import CustomDropdown2 from "../components/CustomDropdown2";

// de rezolvat:
// la refresh e ceva rau - tre sa adaug verifciare pt date goale pt grafice cred
// de schimbat titlurile pe unde trebuie

function Reports() {
    const { user } = useSelector((state) => state.auth);
    const employee = useSelector((state) => state.employee.employee);

    const dispatch = useDispatch();

    const [selectedMonth, setSelectedMonth] = useState(5);
    const [selectedYear, setSelectedYear] = useState(2025);

    const [selectedProblemYear, setSelectedProblemYear] = useState(2025);
    const [selectedEventYear, setSelectedEventYear] = useState(2025);
    const [selectedTherapyYear, setSelectedTherapyYear] = useState(2025);

    const [showProblemsModal, setShowProblemsModal] = useState(false);

    useEffect(() => {
        if (showProblemsModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showProblemsModal]);

    useEffect(() => {
        dispatch(getEmployeeByUserId(user?.id))
    }, [dispatch, user?.id]);

    const monthOptions = [
        { value: 1, label: "Ianuarie" },
        { value: 2, label: "Februarie" },
        { value: 3, label: "Martie" },
        { value: 4, label: "Aprilie" },
        { value: 5, label: "Mai" },
        { value: 6, label: "Iunie" },
        { value: 7, label: "Iulie" },
        { value: 8, label: "August" },
        { value: 9, label: "Septembrie" },
        { value: 10, label: "Octombrie" },
        { value: 11, label: "Noiembrie" },
        { value: 12, label: "Decembrie" },
    ];

    const yearOptions = [
        { value: 2023, label: "2023" },
        { value: 2024, label: "2024" },
        { value: 2025, label: "2025" },
    ];


    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
            <Navbar />

            <div className="px-6 py-24">
                <h1 className="text-3xl font-bold mb-12 text-center text-indigo-800">
                    Raport pentru departamentul {employee?.department}
                </h1>

                {/* Secțiune: Stare emoțională */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Partea stângă */}
                        <div>
                            <div className="flex justify-between mb-4">
                                <h2 className="text-2xl font-semibold mt-3">
                                    Evoluția stărilor emoționale pe parcursul lunii
                                </h2>
                            </div>
                            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                                <MoodEvolutionChart
                                    managerId={user?.id}
                                    selectedMonth={selectedMonth}
                                    selectedYear={selectedYear}
                                />
                            </div>
                        </div>

                        {/* Partea dreaptă */}
                        <div>
                            <div className="flex justify-between items-end mb-4">
                                <h2 className="text-2xl font-semibold m-0">Frecvența stărilor emoționale</h2>
                                <div className="flex gap-4">
                                    <div className="w-40">
                                        <CustomDropdown2
                                            value={selectedMonth}
                                            onChange={setSelectedMonth}
                                            options={monthOptions}
                                        />
                                    </div>
                                    <div className="w-32">
                                        <CustomDropdown2
                                            value={selectedYear}
                                            onChange={setSelectedYear}
                                            options={yearOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                                <MoodFrequencyChart
                                    managerId={user?.id}
                                    selectedMonth={selectedMonth}
                                    selectedYear={selectedYear}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Secțiune: Probleme raportate */}
                <section className="mb-12">
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-2xl font-semibold mb-4">Evoluție Probleme Raportate</h2>

                        <div className="w-32 mb-4">
                            <CustomDropdown2
                                value={selectedProblemYear}
                                onChange={setSelectedProblemYear}
                                options={yearOptions}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row gap-12 items-stretch min-h-[400px]">
                        <div className="flex-1 p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                            <ProblemEvolutionChart
                                managerId={user?.id}
                                selectedYear={selectedProblemYear}
                            />
                        </div>

                        <div className="flex-1 p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] overflow-y-auto">
                            <ProblemsList
                                managerId={user?.id}
                                selectedYear={selectedProblemYear}
                                showAll={showProblemsModal}
                                onShowAll={() => setShowProblemsModal(true)}
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-4">
                        {/* Partea stângă - Participare la evenimente */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Distribuția participării la evenimente</h2>
                            <div className="w-32">
                                <CustomDropdown2
                                    value={selectedEventYear}
                                    onChange={setSelectedEventYear}
                                    options={yearOptions}
                                />
                            </div>
                        </div>

                        {/* Partea dreaptă - Satisfacție sesiuni terapie */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Satisfacția generală pentru sesiunile de terapie</h2>
                            <div className="w-32">
                                <CustomDropdown2
                                    value={selectedTherapyYear}
                                    onChange={setSelectedTherapyYear}
                                    options={yearOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 min-h-[500px]">
                        <div className="p-10 flex items-center justify-center bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                            <EventTypeChart
                                managerId={user?.id}
                                selectedYear={selectedEventYear}
                            />
                        </div>

                        <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                            <TherapySatisfactionChart
                                managerId={user?.id}
                                selectedYear={selectedTherapyYear}
                            />
                        </div>
                    </div>
                </section>

                {/* Secțiune opțională: Obiective și echilibru emoțional */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">
                        Obiective & echilibru emoțional
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                            G6: RadarChart - Obiective personale
                        </div>
                        <div className="p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                            G7: ScatterChart - Obiective vs. mood
                        </div>
                    </div>
                </section>
            </div>

            {showProblemsModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
                    onClick={() => setShowProblemsModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-semibold mb-4">Toate problemele comunicate</h3>
                        <button
                            onClick={() => setShowProblemsModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-2xl font-bold"
                        >
                            &times;
                        </button>
                        <ProblemsList
                            managerId={user?.id}
                            selectedYear={selectedProblemYear}
                            showAll={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reports;