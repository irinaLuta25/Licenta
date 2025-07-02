import React, { useEffect, useRef, useState } from "react";
import CustomDropdown2 from "./CustomDropdown2";
import { AnimatePresence, motion } from "framer-motion";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { createProblem } from "../features/problem/problemSlice";
import { toast } from "react-toastify";


function ReportProblemModal({ onClose }) {

    const [choice, setChoice] = useState(false)
    const [problemText, setProblemText] = useState("")

    const modalRef = useRef();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);


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
        if (user?.id) {
            dispatch(getEmployeeByUserId(user.id));
        }
    }, [user])

    const handleSubmit = async () => {
        if (!problemText) {
            toast.error("Este necesară completarea textului problemei!")
            return;
        }

        if (user && employee) {
            const payload = {
                description: problemText,
                isAnonymous: choice,
                employeeId: employee.id
            }

            try {
                await dispatch(createProblem(payload)).unwrap();
                toast.success("Problema ta a fost înregistrată cu succes!");
                onClose();
            } catch (err) {
                console.error(err);
                toast.error("A apărut o eroare la salvarea problemei.");
            }
        }

    }

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

                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">Raportează o problemă</h2>

                    <label className="text-sm font-medium text-gray-700">Dorești să raportezi în mod anonim?</label>
                    <div className="mb-4 border border-indigo-200 rounded-xl">
                        <CustomDropdown2
                            value={choice}
                            onChange={(val) => {
                                setChoice(val);
                            }}
                            options={[{ label: "DA", value: true }, { label: "NU", value: false }]}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Descrie problema întâmpinată și vom încerca să găsim o soluție!</label>
                        <textarea
                            name="problemText"
                            rows={3}
                            value={problemText}
                            onChange={(e) => setProblemText(e.target.value)}
                            className="w-full border mt-2 border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="block w-44 mt-8 mx-auto bg-indigo-700 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
                    >
                        Trimite
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


export default ReportProblemModal;