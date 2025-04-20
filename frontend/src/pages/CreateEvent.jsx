import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload"

function CreateEvent() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        description: "",
        enrollmentDeadline: "",
        type: "",
        department: "",
        isManagerParticipant: false,
        interval: null,
        image: null,
        questions: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = () => {
        setForm((prev) => ({ ...prev, isManagerParticipant: !prev.isManagerParticipant }));
    };

    const handleDateSelect = (date) => {
        setForm((prev) => ({ ...prev, interval: date }));
    };

    const handleImageUpload = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const addQuestion = () => {
        setForm((prev) => ({
            ...prev,
            questions: [...prev.questions, ""],
        }));
    };

    const updateQuestion = (index, value) => {
        const updated = [...form.questions];
        updated[index] = value;
        setForm((prev) => ({ ...prev, questions: updated }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Date trimise:", form);
        // to do
    };

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <div className="bg-gradient-to-br from-[#c1f7dc] via-[#b2d8f3] to-[#c7b5ff] min-h-screen flex flex-col">
            <div className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <button onClick={() => navigate(-1)} className="text-2xl font-bold hover:underline">
                    ← Back
                </button>
            </div>

            <div className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 space-y-6">
                    <h1 className="text-2xl font-bold text-center text-indigo-800 mb-4">Create a New Event</h1>

                    {step === 1 && (
                        <>
                            <div>
                                <label className="font-medium">Event Name</label>
                                <input name="name" value={form.name} onChange={handleChange} className="w-full border px-3 py-1 rounded-md" required />
                            </div>

                            <div>
                                <label className="font-medium">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-3 py-1 rounded-md" required />
                            </div>

                            <div>
                                <label className="font-medium">Enrollment Deadline</label>
                                <input type="date" name="enrollmentDeadline" value={form.enrollmentDeadline} onChange={handleChange} className="w-full border px-3 py-1 rounded-md" required />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Type</label>
                                <select
                                    name="type"
                                    value={form.type}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Select type</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="training">Training</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Target Department</label>
                                <select
                                    name="department"
                                    value={form.department}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-1 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Select department</option>
                                    <option value="HR">HR</option>
                                    <option value="IT">IT</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <label className="font-semibold mr-4">Is manager a participant?</label>
                                <button
                                    type="button"
                                    onClick={handleToggle}
                                    className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${form.isManagerParticipant ? "bg-indigo-600" : "bg-gray-300"
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 bg-white rounded-full shadow-md transform duration-300 ${form.isManagerParticipant ? "translate-x-7" : ""
                                            }`}
                                    />
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">

                            <div>
                                <label className="font-medium block mb-2">Choose Event Interval</label>
                                <Calendar onChange={handleDateSelect} value={form.interval} />
                                {form.interval && (
                                    <p className="text-sm mt-2 text-gray-700">Selected date: {form.interval.toDateString()}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Upload Event Image</h2>
                            <ImageUpload onImageUpload={(file) => setForm(prev => ({ ...prev, image: file }))} />
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="font-semibold mb-3">Feedback Form</h2>
                            {form.questions.map((q, idx) => (
                                <div key={idx} className="mb-3">
                                    <input
                                        type="text"
                                        value={q}
                                        onChange={(e) => updateQuestion(idx, e.target.value)}
                                        className="w-full border px-3 py-2 rounded-md"
                                        placeholder={`Question ${idx + 1}`}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addQuestion} className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600">
                                Add Question
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between pt-4">
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                                Back
                            </button>
                        )}
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-auto">
                                Next
                            </button>
                        ) : (
                            <button type="submit" onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;
