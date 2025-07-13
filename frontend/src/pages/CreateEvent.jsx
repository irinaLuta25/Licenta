import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { getSpecialistByUserId } from "../features/therapists/therapistsSlice";
import { getIntervalsForTherapist } from "../features/therapists/therapistsSlice"
import { createQuestionForEvent } from "../features/question/questionSlice"
import { updateIntervalStatus } from "../features/interval/intervalSlice"
import { createEvent } from "../features/event/eventSlice"
import ImageUpload from "../components/ImageUpload"
import { toast } from 'react-toastify';
import CustomDropdown2 from "../components/CustomDropdown2";
import "./AvailabilityCalendar2.css"
import { differenceInHours, parseISO } from "date-fns";


function CreateEvent() {
    const [selectedDate, setSelectedDate] = useState(new Date());


    const user = useSelector((state) => state.auth.user)
    const specialist = useSelector((state) => state.therapists.loggedInTherapist);
    const freeIntervals = useSelector((state) => state.therapists.freeIntervals)


    console.log("user logat: ", user)
    console.log("specialist logat: ", specialist)
    console.log("intervale libere: ", freeIntervals)

    const dispatch = useDispatch()

    const availableDates = freeIntervals.map(interval => new Date(interval.date).toDateString());

    const selectedDateString = selectedDate.toDateString();
    const intervalsForSelectedDate = freeIntervals.filter(interval =>
        new Date(interval.date).toDateString() === selectedDateString
    );


    useEffect(() => {
        if (user?.id && !specialist?.id) {
            dispatch(getSpecialistByUserId(user.id));
        }
        if (specialist?.id && freeIntervals.length === 0) {
            console.log("Dispatch getIntervalsForTherapist din CreateEvent");
            dispatch(getIntervalsForTherapist(specialist.id));
        }
    }, [dispatch, specialist?.id, freeIntervals.length]);



    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: "",
        description: "",
        enrollmentDeadlineDate: "",
        enrollmentDeadlineTime: "",
        type: "workshop",
        department: "General",
        interval: null,
        image: null,
        questions: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step !== 4) {
            return;
        }

        if (form.questions.length === 0) {
            toast.warning("Adaugă cel puțin o întrebare în formularul de feedback!");
            return;
        }

        try {
            if (!form.interval) throw new Error("Intervalul nu există");
            if (!specialist?.id) throw new Error("Specialistul nu este valid");

            const enrollmentDeadline = new Date(`${form.enrollmentDeadlineDate}T${form.enrollmentDeadlineTime}`);

            const formData = new FormData();
            formData.append("file", form.image);
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("specialistId", specialist.id);
            formData.append("enrollmentDeadline", enrollmentDeadline.toISOString());
            formData.append("targetDepartment", form.department);
            formData.append("intervalId", form.interval.id);
            formData.append("type", form.type);
            formData.append("dateTime", selectedDate.toISOString());

            const res = await fetch("http://localhost:4848/api/event/create", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Evenimentul nu s-a putut crea!");
            const eventData = await res.json();

            for (const text of form.questions) {
                if (text.trim()) {
                    await dispatch(createQuestionForEvent({ text, eventId: eventData.id })).unwrap();
                }
            }

            await dispatch(updateIntervalStatus({ id: form.interval.id, status: true }));
            await dispatch(getIntervalsForTherapist(specialist.id));
            toast.success("Eveniment creat cu succes!");
            navigate(-1);
        } catch (err) {
            toast.error(err.message || "Evenimentul nu s-a putut crea!");
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!form.name || !form.description || !form.type || !form.department) {
                toast.warning("Toate câmpurile sunt obligatorii.");
                return;
            }

        }

        if (step === 2) {
            if (!form.enrollmentDeadlineDate || !form.enrollmentDeadlineTime || !form.interval) {
                toast.warning("Completează data și ora pentru termenul limită și selectează un interval.");
                return;
            }

            

            const [edYear, edMonth, edDay] = form.enrollmentDeadlineDate.split("-").map(Number);
            const [edHour, edMinute] = form.enrollmentDeadlineTime.split(":").map(Number);
            const enrollmentDateTime = new Date(edYear, edMonth - 1, edDay, edHour, edMinute);

            const [evHour, evMinute] = form.interval.beginTime.split(":").map(Number);
            const eventStartTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                evHour,
                evMinute
            );

            const diffInMs = eventStartTime.getTime() - enrollmentDateTime.getTime();
            const diffInHours = diffInMs / (1000 * 60 * 60);

            if (diffInHours < 24) {
                toast.warning(
                    "Termenul limită trebuie să fie cu cel puțin 24h înainte de începerea evenimentului."
                );
                return;
            }

            const now = new Date();
            if (enrollmentDateTime < now) {
                toast.warning("Termenul limită pentru înscriere nu poate fi în trecut.");
                return;
            }
        }

        if (step === 3 && !form.image) {
            toast.warning("Te rog încarcă o imagine!");
            return;
        }

        setStep((prev) => prev + 1);
    };
    const prevStep = () => setStep((prev) => prev - 1);

    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <div className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <button onClick={() => navigate(-1)} className="text-2xl font-bold hover:underline">
                    ← Înapoi
                </button>
            </div>

            <div className="flex flex items-center min-h-[calc(100vh-64px)] justify-center py-8">
                <form noValidate className="w-full max-w-3xl bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-xl hover:shadow-2xl border border-indigo-300/30 drop-shadow-lg rounded-2xl p-6 space-y-6">


                    <h1 className="text-2xl font-bold text-center text-indigo-800 mb-4">Crează un eveniment nou</h1>

                    {step === 1 && (
                        <>
                            <div>
                                <label className="font-medium">Denumire</label>
                                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" required />
                            </div>

                            <div>
                                <label className="font-medium">Descriere</label>
                                <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner" required />
                            </div>



                            <div>
                                <label className="block font-semibold mb-1">Tip</label>
                                <CustomDropdown2
                                    value={form.type}
                                    onChange={(val) => setForm((prev) => ({ ...prev, type: val }))}
                                    options={[
                                        { label: "Workshop", value: "workshop" },
                                        { label: "Training", value: "training" },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block font-semibold mb-1">Departament vizat</label>
                                <CustomDropdown2
                                    value={form.department}
                                    onChange={(val) => setForm((prev) => ({ ...prev, department: val }))}
                                    options={[
                                        { label: "General", value: "General" },
                                        { label: "Resurse Umane", value: "HR" },
                                        { label: "IT", value: "IT" },
                                        { label: "Marketing", value: "Marketing" },
                                        { label: "Financiar", value: "Sales" },
                                    ]}
                                />
                            </div>

                        </>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                            <div>
                                <label className="font-medium block mb-2">Alege un interval</label>
                                <Calendar
                                    className="custom-calendar2"
                                    onChange={(date) => {
                                        setSelectedDate(date);
                                        setForm((prev) => ({ ...prev, interval: null }));
                                    }}
                                    value={selectedDate}
                                    tileClassName={({ date }) => {
                                        return availableDates.includes(date.toDateString()) ? 'highlight-available' : null
                                    }}
                                />
                                {selectedDate && (
                                    <p className="mt-4 text-sm  text-indigo-700 font-medium">
                                        Dată selectată: {selectedDate.toLocaleDateString("ro-RO")}
                                    </p>
                                )}
                            </div>

                            <div className="w-full sm:w-1/2">
                                <label className="font-medium block mb-2">Termen limită pentru înscriere</label>
                                <div className="flex gap-2 mb-4 justify-between">
                                    <input
                                        type="date"
                                        name="enrollmentDeadlineDate"
                                        value={form.enrollmentDeadlineDate}
                                        onChange={handleChange}
                                        className="p-2 rounded bg-white/70 shadow-inner"
                                    />
                                    <input
                                        type="time"
                                        name="enrollmentDeadlineTime"
                                        value={form.enrollmentDeadlineTime}
                                        onChange={handleChange}
                                        className="p-2 rounded bg-white/70 shadow-inner"
                                    />
                                </div>


                                <div className="w-full flex justify-center">
                                    <div className="w-64 min-h-[120px] p-4 rounded-xl bg-white/70 shadow-inner text-gray-700 overflow-hidden">
                                        <h3 className="text-indigo-800 font-semibold mb-2 text-center">Intervale disponibile</h3>

                                        <div className="flex flex-col gap-2 items-center w-full">
                                            {intervalsForSelectedDate.length === 0 ? (
                                                <p className="text-gray-600 italic text-center text-sm">Nu ai setat intervale disponibile pentru această zi..</p>
                                            ) : (
                                                intervalsForSelectedDate.map((interval) => {
                                                    const isSelected = form.interval?.id === interval.id;
                                                    return (
                                                        <button
                                                            type="button"
                                                            key={interval.id}
                                                            onClick={() => setForm((prev) => ({ ...prev, interval }))}
                                                            className={`w-full max-w-[10rem] text-center px-4 py-2 rounded-md truncate transition ${isSelected
                                                                ? "bg-indigo-600 text-white font-semibold"
                                                                : "bg-white text-gray-800 border border-gray-300 hover:bg-indigo-100"
                                                                }`}
                                                        >
                                                            {interval.beginTime.slice(0, 5)} - {interval.endTime.slice(0, 5)}
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>



                                {form.interval && (
                                    <p className="mt-4 text-sm  text-indigo-700 font-medium">
                                        Interval selectat:{" "}
                                        {form.interval.beginTime.slice(0, 5)} - {form.interval.endTime.slice(0, 5)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Încarcă o imagine pentru eveniment</h2>
                            <ImageUpload
                                onImageUpload={(file) => setForm((prev) => ({ ...prev, image: file }))}
                                selectedFile={form.image}
                            />
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="font-semibold mb-3">Formular de feedback</h2>
                            {form.questions.map((q, idx) => (
                                <div key={idx} className="mb-3">
                                    <input
                                        type="text"
                                        value={q}
                                        onChange={(e) => updateQuestion(idx, e.target.value)}
                                        className="w-full p-2.5 rounded-xl bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none shadow-inner"
                                        placeholder={`Întrebarea ${idx + 1}`}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addQuestion} className="bg-indigo-500 text-white px-4 py-1 rounded hover:bg-indigo-600">
                                Adaugă întrebare
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between pt-2">
                        {step > 1 && (
                            <button type="button" onClick={prevStep} className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded hover:bg-indigo-300">
                                Înapoi
                            </button>
                        )}
                        {step < 4 ? (
                            <button type="button" onClick={nextStep} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 ml-auto">
                                Continuă
                            </button>
                        ) : (
                            <button type="button" onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ml-auto">
                                Trimite
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;
