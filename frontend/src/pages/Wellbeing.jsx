import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import AddProgressModal from "../components/AddProgressModal";
import AddGoalModal from "../components/AddGoalModal";
import MoodListModal from "../components/MoodListModal";
import MoodModal from "../components/MoodModal";
import GoalProgressChart from "../components/Charts/GoalProgressChart";



import BadgeIcon from "../components/BadgeIcon";

import Calendar from "react-calendar";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchHabitTrackingByGoalId, createHabitTracking } from "../features/habitTracking/habitTrackingSlice";
import { fetchEmployeeGoals, deleteEmployeeGoal } from "../features/employeeGoals/employeeGoalSlice";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { fetchRewardsByEmployee } from "../features/employeeReward/employeeRewardSlice";
import { fetchAllRewards } from "../features/reward/rewardSlice";
import { fetchEmotionalStatesByEmployeeId } from "../features/emotionalState/emotionalStateSlice";

const categoryColors = {
    "productivitate": "#6366f1", // indigo
    "activitate fizica": "#22c55e", // green
    "stil de viata": "#eab308", // yellow
    "sanatate emotionala": "#ec4899", // pink
    "dezvoltare personala": "#3b82f6", // blue
};

const moodEmojiMap = {
    Energic: "😄",
    Optimist: "😄",
    Recunoscător: "😄",

    Calm: "🙂",
    Concentrat: "🙂",
    Motivat: "🙂",

    Obosit: "😐",
    Apat: "😐",
    Indiferent: "😐",

    Stresat: "😞",
    Trist: "😞",
    Furios: "😞",

    Anxios: "😭",
    Dezamagit: "😭",
    Deznadajduit: "😭",
};


function Wellbeing() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const { trackingsByGoalId } = useSelector((state) => state.habitTracking);
    const { goals: employeeGoals } = useSelector((state) => state.employeeGoals);
    const emotionalStates = useSelector((state) => state.emotionalState.states);

    const [selectedGoal, setSelectedGoal] = useState(null);

    const [selectedPeriodFilter, setSelectedPeriodFilter] = useState("toate");
    const [currentPage, setCurrentPage] = useState(1);
    const goalsPerPage = 9;

    const filteredGoals = selectedPeriodFilter === "toate"
        ? employeeGoals
        : employeeGoals.filter((g) => g.period === selectedPeriodFilter);

    const indexOfLastGoal = currentPage * goalsPerPage;
    const indexOfFirstGoal = indexOfLastGoal - goalsPerPage;
    const currentGoals = filteredGoals.slice(indexOfFirstGoal, indexOfLastGoal);
    const totalPages = Math.ceil(filteredGoals.length / goalsPerPage);


    const handleOpenProgressModal = (goal) => setSelectedGoal(goal);
    const handleCloseProgressModal = () => setSelectedGoal(null);
    const handleSubmitProgress = (goalId, value) => {
        dispatch(createHabitTracking({ employeeGoalId: goalId, value }));
        if (employee?.id) {
            dispatch(fetchRewardsByEmployee(employee.id));
        }
    };

    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
    const handleOpenGoalModal = () => setIsAddGoalModalOpen(true);
    const handleCloseGoalModal = () => setIsAddGoalModalOpen(false);

    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
    const handleOpenMoodModal = () => setIsMoodModalOpen(true);
    const handleCloseMoodModal = () => setIsMoodModalOpen(false);

    const employeeRewards = useSelector((state) => state.employeeReward.rewards);
    const rewardList = useSelector((state) => state.reward.rewards);

    const [goalToDelete, setGoalToDelete] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const openDeleteModal = (goalId) => {
        setGoalToDelete(goalId);
        setShowConfirmModal(true);
    };

    const confirmDeleteGoal = () => {
        if (goalToDelete) {
            dispatch(deleteEmployeeGoal(goalToDelete));
            setShowConfirmModal(false);
            setGoalToDelete(null);
        }
    };

    const [selectedDate, setSelectedDate] = useState(null);
    const [isMoodListModalOpen, setIsMoodListModalOpen] = useState(false);



    useEffect(() => {
        if (user?.id) {
            if (user?.role === "angajat") {
                dispatch(getEmployeeByUserId(user.id));
                if (employee?.id) {
                    dispatch(fetchEmployeeGoals(employee.id));
                }
            }
        }
    }, [dispatch, user?.id, employee?.id, user?.role]);

    useEffect(() => {
        if (employeeGoals.length > 0) {
            employeeGoals.forEach(goal => {
                dispatch(fetchHabitTrackingByGoalId(goal.id));
            });
        }
    }, [employeeGoals, dispatch]);

    useEffect(() => {
        if (employee?.id) {
            dispatch(fetchRewardsByEmployee(employee.id));
            dispatch(fetchAllRewards());
        }
    }, [employee?.id, dispatch]);

    useEffect(() => {
        if (employee?.id) {
            dispatch(fetchEmotionalStatesByEmployeeId(employee.id));
        }
    }, [employee?.id, dispatch]);

    const getRewardLabel = (category, level) => {
        const reward = employeeRewards.find(
            r => r.reward?.category === category && r.level === level
        );
        return reward?.reward?.name || "Blocat";
    };


    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800">
            <Navbar />

            {/* Main container */}
            <div className="px-6 py-24 flex flex-col gap-4">

                {/* mood + habits*/}
                <div className="flex flex-row w-full gap-4">

                    <div className="flex flex-col w-[40%] gap-6 p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                        {/* track mood */}
                        <div className="flex flex-col items-center border-none p-4 gap-4 backdrop-blur-sm rounded-[1rem] bg-[linear-gradient(145deg,_#e2d9ff,_#c3e0ff,_#dee3ff)]">
                            <h1 className="text-2xl font-semibold text-indigo-800">Bună! Cum Îți merge ziua?</h1>
                            <button
                                className="inline-block bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition duration-200 hover:bg-indigo-500"
                                onClick={handleOpenMoodModal}>
                                Înregistrează stare
                            </button>
                        </div>

                        {/* calendar moods */}
                        <div>
                            <Calendar
                                className="custom-schedule-calendar"
                                onClickDay={(value) => {
                                    setSelectedDate(value);
                                    setIsMoodListModalOpen(true);
                                }}
                                tileContent={({ date, view }) => {
                                    if (view !== "month" || !emotionalStates?.length) return null;

                                    const dayEntries = emotionalStates.filter((e) => {
                                        const recordedDate = new Date(e.createdAt);
                                        return (
                                            recordedDate.getFullYear() === date.getFullYear() &&
                                            recordedDate.getMonth() === date.getMonth() &&
                                            recordedDate.getDate() === date.getDate()
                                        );
                                    });

                                    if (dayEntries.length === 0) return null;

                                    const latestEntry = [...dayEntries].sort(
                                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                                    )[0];

                                    return (
                                        <div className="text-center text-lg">
                                            {moodEmojiMap[latestEntry.mood] || "❓"}
                                        </div>
                                    );
                                }}
                            />


                        </div>
                    </div>

                    {/* habits */}
                    <div className="w-[60%] p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)] flex flex-col gap-6">

                        {/* Buton adaugă obiectiv */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-indigo-800">Obiectivele mele</h2>
                            <button
                                onClick={handleOpenGoalModal}
                                className="bg-indigo-700 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-500 transition duration-200"
                            >
                                + Adaugă obiectiv
                            </button>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {["toate", "zilnic", "săptămânal", "lunar", "anual"].map((label) => (
                                <button
                                    key={label}
                                    onClick={() => setSelectedPeriodFilter(label)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${selectedPeriodFilter === label
                                        ? "bg-indigo-600 text-white border-indigo-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                        }`}
                                >
                                    {label.charAt(0).toUpperCase() + label.slice(1)}
                                </button>
                            ))}
                        </div>


                        {/* Carduri obiective */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[570px] pr-2">
                            {currentGoals.map((goal) => {
                                const { id, habit, targetValue, period } = goal;

                                const goalTrackings = trackingsByGoalId?.[id] || [];

                                const today = new Date();
                                const relevantTrackings = goalTrackings.filter((t) => {
                                    const recDate = new Date(t.createdAt);

                                    if (period === "zilnic") {
                                        return recDate.toDateString() === today.toDateString();
                                    }
                                    if (period === "săptămânal") {
                                        const weekStart = new Date(today);
                                        weekStart.setDate(today.getDate() - today.getDay());
                                        return recDate >= weekStart && recDate <= today;
                                    }
                                    if (period === "lunar") {
                                        return (
                                            recDate.getMonth() === today.getMonth() &&
                                            recDate.getFullYear() === today.getFullYear()
                                        );
                                    }
                                    return false;
                                });

                                const currentValue = relevantTrackings.reduce((sum, t) => sum + t.value, 0);
                                const progressPercent = Math.min((currentValue / targetValue) * 100, 100);
                                const isCompleted = progressPercent >= 100;

                                return (
                                    <div
                                        key={id}
                                        className={`relative rounded-xl shadow p-4 flex flex-col justify-between gap-4 ${isCompleted ? "bg-green-100 border-green-300" : "bg-white"
                                            }`}
                                    >
                                        {isCompleted && (
                                            <div className="absolute top-2 right-2 text-green-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}

                                        {!isCompleted && (
                                            <button
                                                onClick={() => openDeleteModal(id)}
                                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                                title="Șterge obiectiv"
                                            >
                                                <FaTrash className="w-5 h-5" />
                                            </button>
                                        )}


                                        <h3 className="text-lg font-semibold text-indigo-700">{habit?.name}</h3>

                                        <div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-300 ${isCompleted ? "bg-green-500" : "bg-indigo-500"
                                                        }`}
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>

                                            <div className="text-sm text-gray-700 mt-1 mb-2 flex justify-between">
                                                <span>
                                                    <span className="font-medium text-indigo-800">{currentValue}</span>
                                                    <span className="text-gray-500"> / {targetValue}{habit?.unit}</span>
                                                </span>
                                                <span className="italic text-gray-600 capitalize">{period}</span>
                                            </div>
                                        </div>

                                        {!isCompleted ? (
                                            <button
                                                onClick={() => handleOpenProgressModal(goal)}
                                                className="self-end mt-2 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200 transition"
                                            >
                                                + Adaugă progres
                                            </button>
                                        ) : (
                                            <div className="mt-2 py-1 h-[32px]"></div>
                                        )}

                                    </div>
                                );
                            })}



                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-4 gap-4 items-center">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    ‹ Înapoi
                                </button>
                                <span className="text-sm text-gray-700">
                                    Pagina {currentPage} din {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Înainte ›
                                </button>
                            </div>
                        )}

                    </div>


                </div>

                <GoalProgressChart
                    employeeGoals={employeeGoals}
                    trackingsByGoalId={trackingsByGoalId}
                />

                <div className="w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-6">Badge-urile mele</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {["productivitate", "activitate fizica", "stil de viata", "sanatate emotionala", "dezvoltare personala"].map((cat) => {
                            const color = categoryColors[cat];
                            const baseReward = rewardList.find((r) => r.category === cat);
                            if (!baseReward) return null;

                            const earnedLevels = employeeRewards
                                .filter((r) => r.reward?.category === cat)
                                .map((r) => r.level);

                            const maxLevel = earnedLevels.length > 0 ? Math.max(...earnedLevels) : 0;
                            const hasAny = maxLevel > 0;

                            return (
                                <div key={cat} className="flex flex-col gap-2 items-start">
                                    <h3 className="text-lg font-semibold capitalize text-gray-800">{cat}</h3>

                                    <div className="flex items-center gap-4 ">
                                        {/* Badge actual */}
                                        <div className="relative w-[120px] h-[120px] flex items-center justify-center">

                                            <BadgeIcon
                                                level={hasAny ? maxLevel : 1}
                                                label={hasAny ? getRewardLabel(cat, maxLevel) : "Blocat"}

                                                filled={hasAny}
                                                color={color}
                                            />
                                        </div>


                                        {/* Hint spre nivelul urmator */}
                                        <div className="text-sm text-gray-600 italic max-w-[180px]">
                                            {hasAny
                                                ? `Continuă pentru a atinge Nivel ${maxLevel + 1}.`
                                                : `Începe prin a atinge 5 obiective în această categorie.`}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>

            {selectedGoal && (
                <AddProgressModal
                    goal={selectedGoal}
                    onClose={handleCloseProgressModal}
                    onSubmit={handleSubmitProgress}
                />
            )}

            {isAddGoalModalOpen && employee?.id && (
                <AddGoalModal
                    onClose={handleCloseGoalModal}
                    employeeId={employee.id}
                />
            )}

            {isMoodModalOpen && (
                <MoodModal
                    onClose={handleCloseMoodModal}
                    employeeId={employee?.id}
                    onSave={() => {
                        handleCloseMoodModal();
                    }}
                />
            )}

            {isMoodListModalOpen && selectedDate && (
                <MoodListModal
                    date={selectedDate}
                    emotionalStates={emotionalStates}
                    onClose={() => setIsMoodListModalOpen(false)}
                />
            )}

            {showConfirmModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => setShowConfirmModal(false)}
                >
                    <div
                        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ești sigur că vrei să ștergi acest obiectiv?</h3>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={confirmDeleteGoal}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Confirmă
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Anulează
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>


    )
}

export default Wellbeing;