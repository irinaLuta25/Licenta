import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { createEmotionalState, fetchEmotionalStatesByEmployeeId } from "../features/emotionalState/emotionalStateSlice";

const emojiMoods = [
    { label: "Foarte bine", emoji: "😄", mood: "foarte_bine" },
    { label: "Bine", emoji: "🙂", mood: "bine" },
    { label: "Neutru", emoji: "😐", mood: "neutru" },
    { label: "Rau", emoji: "😞", mood: "rau" },
    { label: "Foarte rau", emoji: "😭", mood: "foarte_rau" },
];

const emotionalStatesByMood = {
    foarte_bine: ["Energic", "Optimist", "Recunoscător"],
    bine: ["Calm", "Concentrat", "Motivat"],
    neutru: ["Obosit", "Distant", "Plictisit"],
    rau: ["Stresat", "Trist", "Confuz"],
    foarte_rau: ["Anxios", "Dezamagit", "Furios"],
};

const MoodModal = ({ onClose, employeeId, onSave }) => {
    const dispatch = useDispatch();
    const modalRef = useRef();

    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [intensity, setIntensity] = useState(3);
    const [details, setDetails] = useState("");

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleStateSelect = (state) => {
        setSelectedState((prev) => (prev === state ? null : state));
    };

    const handleSubmit = () => {
        if (!selectedState) return;

        const payload = {
            mood: selectedState,
            intensity,
            createdAt: new Date().toISOString(),
            details,
            employeeId,
        };

        dispatch(createEmotionalState(payload)).then(() => {
            dispatch(fetchEmotionalStatesByEmployeeId(employeeId));
            onSave();
            onClose();
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    ref={modalRef}
                    className="bg-white w-[95%] max-w-xl p-6 rounded-xl shadow-xl relative"

                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        &times;
                    </button>
                    
                    {step === 1 && (
                        <>
                            <h2 className="text-xl font-semibold text-indigo-800 mb-6 text-center">Cum te simți astăzi?</h2>
                            <div className="grid grid-cols-5 gap-4 justify-center">
                                {emojiMoods.map((mood) => (
                                    <button
                                        key={mood.label}
                                        onClick={() => {
                                            setSelectedMood(mood);
                                            setStep(2);
                                        }}
                                        className="flex flex-col items-center gap-2 hover:scale-110 transition"
                                    >
                                        <span className="text-4xl">{mood.emoji}</span>
                                        <span className="text-sm text-gray-700 font-medium">{mood.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 2 && selectedMood && (
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-6xl">{selectedMood.emoji}</span>
                            <h3 className="text-md text-indigo-700 font-semibold">Ce stare descrie cel mai bine cum te simți?</h3>

                            <div className="flex flex-wrap justify-center gap-2">
                                {emotionalStatesByMood[selectedMood.mood].map((state) => (
                                    <span
                                        key={state}
                                        onClick={() => handleStateSelect(state)}
                                        className={`px-3 py-1 rounded-full text-sm cursor-pointer transition border ${selectedState === state
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            }`}
                                    >
                                        {state}
                                    </span>
                                ))}
                            </div>

                            <div className="w-full mt-4">
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Intensitate: {intensity}
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={intensity}
                                    onChange={(e) => setIntensity(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <textarea
                                rows={3}
                                placeholder="Detalii opționale..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="w-full border mt-2 border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />

                            <button
                                onClick={handleSubmit}
                                className="mt-4 bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
                                disabled={!selectedState}
                            >
                                Înregistrează
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MoodModal;
