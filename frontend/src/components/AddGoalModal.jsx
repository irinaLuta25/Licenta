import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAllHabits } from "../features/habit/habitSlice";
import { createEmployeeGoal, fetchEmployeeGoals } from "../features/employeeGoals/employeeGoalSlice";
import CustomDropdown2 from "./CustomDropdown2";
import { toast } from "react-toastify";

const categoryColors = {
    productivitate: "bg-indigo-100 text-indigo-800",
    "activitate fizica": "bg-green-100 text-green-800",
    "stil de viata": "bg-yellow-100 text-yellow-800",
    "sanatate emotionala": "bg-pink-100 text-pink-800",
    "dezvoltare personala": "bg-blue-100 text-blue-800",
};

const categoryOptions = [
    { value: "Toate categoriile", label: "Toate categoriile" },
    { value: "productivitate", label: "Productivitate" },
    { value: "activitate fizica", label: "Activitate fizică" },
    { value: "stil de viata", label: "Stil de viață" },
    { value: "sanatate emotionala", label: "Sănătate emoțională" },
    { value: "dezvoltare personala", label: "Dezvoltare personală" },
];

const periodOptions = [
    { value: "zilnic", label: "Zilnic" },
    { value: "săptămânal", label: "Săptămânal" },
    { value: "lunar", label: "Lunar" },
    { value: "anual", label: "Anual" },
];

function AddGoalModal({ onClose, employeeId }) {
    const dispatch = useDispatch();
    const { habits } = useSelector((state) => state.habit);
        console.log("aaaaaa",habits)


    const [selectedCategory, setSelectedCategory] = useState("Toate categoriile");
    const [selectedHabitId, setSelectedHabitId] = useState("");
    const [targetValue, setTargetValue] = useState("");
    const [period, setPeriod] = useState("zilnic");
    const [error, setError] = useState("");

    const modalRef = useRef();

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        dispatch(fetchAllHabits());
    }, [dispatch]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    const handleSubmit = async () => {
        if (!selectedHabitId || !targetValue || Number(targetValue) <= 0) {
            setError("Introduceți o valoare țintă validă (> 0).");
            return;
        }

        setError("");

        await dispatch(
            createEmployeeGoal({
                employeeId,
                habitId: selectedHabitId,
                targetValue: Number(targetValue),
                period,
            })
        );

        toast.success("Obiectiv adăugat cu succes!")

        await dispatch(fetchEmployeeGoals(employeeId));
        onClose();
    };

    const filteredHabits =
        selectedCategory === "Toate categoriile"
            ? habits
            : habits.filter((h) => h.category === selectedCategory);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    ref={modalRef}
                    className="bg-white rounded-2xl p-8 w-[550px] max-w-full shadow-xl relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-semibold"
                    >
                        &times;
                    </button>

                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">Adaugă obiectiv</h2>

                    <label className="text-sm font-medium text-gray-700">Alege categorie:</label>
                    <div className="mb-4 border border-indigo-200 rounded-xl">
                        <CustomDropdown2
                            value={selectedCategory}
                            onChange={(val) => {
                                setSelectedCategory(val);
                                setSelectedHabitId("");
                            }}
                            options={categoryOptions}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {filteredHabits.map((habit) => {
                            const isSelected = selectedHabitId === habit.id;
                            const baseColor = categoryColors[habit.category] || "bg-gray-200 text-gray-800";
                            return (
                                <button
                                    key={habit.id}
                                    onClick={() => setSelectedHabitId(habit.id)}
                                    className={`px-3 py-1 rounded-full text-sm transition border ${isSelected
                                        ? "border-indigo-700 ring-2 ring-indigo-300"
                                        : "border-transparent"
                                        } ${baseColor} hover:opacity-80`}
                                >
                                    {habit.name} ({habit.unit})
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-3">
                        <input
                            type="number"
                            min="1"
                            placeholder="Valoare țintă"
                            value={targetValue}
                            onChange={(e) => setTargetValue(e.target.value)}
                            className="w-full border border-indigo-200 rounded-xl shadow-inner px-4 py-2 text-md focus:outline-indigo-600"
                        />
                        {error && (
                            <p className="text-sm text-red-600 -mt-2">{error}</p>
                        )}

                        <div className="border border-indigo-200 rounded-xl">
                            <CustomDropdown2
                                value={period}
                                onChange={(val) => setPeriod(val)}
                                options={periodOptions}
                            />
                        </div>

                    </div>

                    <button
                        onClick={handleSubmit}
                        className="block w-44 mt-8 mx-auto bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
                    >
                        Salvează
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default AddGoalModal;
