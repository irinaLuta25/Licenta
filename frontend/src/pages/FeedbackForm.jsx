import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CustomDropdown2 from "../components/CustomDropdown2";
import { getQuestionsByTherapySessionId, getQuestionsByEventId } from "../features/question/questionSlice";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { createAnswer } from "../features/answer/answerSlice";
import { updateTherapySession } from "../features/therapySessions/therapySessionsSlice";
import { toast } from "react-toastify";

const FeedbackForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { id } = useParams();
    const isTherapy = location.pathname.includes("/therapySession");

    const questions = useSelector((state) => state.question.list);
    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);

    const [answers, setAnswers] = useState({});
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [satisfactionScore, setSatisfactionScore] = useState(3);

    useEffect(() => {
        if (id) {
            if (isTherapy) {
                dispatch(getQuestionsByTherapySessionId(id));
            } else {
                dispatch(getQuestionsByEventId(id));
            }
        }
    }, [id, isTherapy, dispatch]);

    useEffect(() => {
        if (user) {
            dispatch(getEmployeeByUserId(user.id));
        }
    }, [user, dispatch]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            for (const question of questions) {
                const answerText = answers[question.id];
                if (answerText && answerText.trim() !== "") {
                    await dispatch(
                        createAnswer({
                            answer: answerText,
                            isAnonymous: isAnonymous,
                            questionId: question.id,
                            employeeId: employee.id,
                        })
                    ).unwrap();
                }
            }
            console.log("isTherapy este:", isTherapy);
            if (isTherapy) {
                console.log("Trimitem update:", {
                    therapySessionId: id,
                    updates: { satisfactionScore }
                });
                await dispatch(updateTherapySession({
                    therapySessionId: id,
                    updates: {
                        satisfactionScore
                    }
                })).unwrap();
            }

            toast.success("Feedback submitted successfully!");
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit feedback.");
        }
    };

    const satisfactionOptions = [1, 2, 3, 4, 5].map((score) => ({
        value: score,
        label: `${score} – ${["Very Poor", "Poor", "Average", "Good", "Excellent"][score - 1]}`
    }));

    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-700 text-white px-6 py-3 pb-4 flex justify-between items-center shadow-md">
                <button
                    onClick={() => navigate(-1)}
                    className="text-2xl font-bold hover:underline"
                >
                    ← Back
                </button>
            </div>

            <div className="flex flex-col items-center min-h-[calc(100vh-64px)] justify-center py-8">
                <div className="w-full max-w-xl bg-white/30 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                    <h1 className="text-2xl font-bold text-center text-indigo-800 mb-8">Feedback Form</h1>

                    {questions.length === 0 ? (
                        <p className="text-gray-700 text-center">No questions available.</p>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {questions.map((question) => (
                                <div key={question.id} className="flex flex-col">
                                    <label className="text-md font-medium text-black mb-2">
                                        {question.text}
                                    </label>
                                    <textarea
                                        className="rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Your answer..."
                                        value={answers[question.id] || ""}
                                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    />
                                </div>
                            ))}

                            <div className="flex items-center justify-between mb-6">
                                <label className="text-black font-medium">Send as Anonymous?</label>
                                <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-md font-medium text-black mb-2">
                                    How satisfied were you with this session?
                                </label>
                                <CustomDropdown2
                                    value={satisfactionScore}
                                    onChange={setSatisfactionScore}
                                    options={satisfactionOptions}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Submit Feedback
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackForm;
