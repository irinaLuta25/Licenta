import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AddProgressModal({ goal, onClose, onSubmit }) {
    const [value, setValue] = useState("");
    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    const handleSubmit = () => {
        const numericValue = Number(value);
        if (!value || isNaN(numericValue) || numericValue < 0 || !Number.isInteger(numericValue)) return;
        onSubmit(goal.id, numericValue);
        onClose();
    };

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
                    className="bg-white rounded-2xl p-8 w-[350px] max-w-full shadow-xl relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-semibold"
                    >
                        &times;
                    </button>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-indigo-800 mb-3">Adaugă progres</h2>

                    {/* Habit info */}
                    <p className="text-sm text-gray-600 mb-4">
                        {goal?.habit?.name} – <span className="text-gray-800 font-medium">{goal?.habit?.unit}</span>
                    </p>

                    {/* Input */}
                    <input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Introdu un număr întreg pozitiv"
                    />

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full mt-5 bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
                    >
                        Înregistrează
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default AddProgressModal;
