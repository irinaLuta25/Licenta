import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const emojiMap = {
    Energic: "😄", Optimist: "😄", Recunoscător: "😄",
    Calm: "🙂", Concentrat: "🙂", Motivat: "🙂",
    Obosit: "😐", Distant: "😐", Plictisit: "😐",
    Stresat: "😞", Trist: "😞", Confuz: "😞",
    Anxios: "😭", Dezamagit: "😭", Furios: "😭",
};

const MoodListModal = ({ date, emotionalStates, onClose }) => {
    const selectedEntries = emotionalStates.filter((entry) => {
        const recorded = new Date(entry.createdAt);
        return (
            recorded.getFullYear() === date.getFullYear() &&
            recorded.getMonth() === date.getMonth() &&
            recorded.getDate() === date.getDate()
        );
    });

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
                    className="relative bg-white max-w-lg w-[90%] p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]"
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
                    <h2 className="text-xl font-semibold text-indigo-800 mb-4 text-center">
                        Emoțiile din {date.toLocaleDateString()}
                    </h2>

                    {selectedEntries.length === 0 ? (
                        <p className="text-center text-gray-600">Nicio stare înregistrată în această zi.</p>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {selectedEntries
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((entry, index) => {
                                    const time = new Date(entry.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <li key={index} className="border rounded-lg p-3 flex items-center gap-4 bg-gray-50">
                                            <div className="text-3xl">{emojiMap[entry.mood] || "❓"}</div>
                                            <div className="flex flex-col">
                                                <span className="text-indigo-700 font-semibold">{entry.mood}</span>
                                                <span className="text-sm text-gray-500">{time}</span>
                                                {entry.details && (
                                                    <span className="text-sm text-gray-600 italic mt-1">{entry.details}</span>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                        </ul>
                    )}


                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MoodListModal;
