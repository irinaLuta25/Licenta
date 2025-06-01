import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { getAllEvents, getAllEventsByTargetDepartment, deleteEventById } from "../features/event/eventSlice";
import { getSpecialistByUserId } from "../features/therapists/therapistsSlice";
import { getEmployeeEventsByEmployeeId, createEmployeeEvent } from "../features/employeeEvent/employeeEventSlice";
import { getAllIntervals, updateIntervalStatus } from "../features/interval/intervalSlice";
import EventCard from "../components/EventCard";
import { FiPlusCircle } from "react-icons/fi";
import { toast } from "react-toastify";

function Events() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");
    const [modalEvent, setModalEvent] = useState(null);
    const [modalType, setModalType] = useState(""); // "signUp" | "delete"

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const events = useSelector((state) => state.event.list);
    const specialist = useSelector((state) => state.therapists.loggedInTherapist);
    const intervals = useSelector(state => state.interval.intervalsById || {});

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id && user?.role === "angajat") {
                const res = await dispatch(getEmployeeByUserId(user.id));
                const dept = res.payload?.department;
                if (dept) await dispatch(getAllEventsByTargetDepartment(dept));
                await dispatch(getEmployeeEventsByEmployeeId(res.payload.id));
            } else if (user?.role === "specialist") {
                await dispatch(getAllEvents());
                await dispatch(getSpecialistByUserId(user?.id));
            }
            await dispatch(getAllIntervals());
        };

        fetchData();
    }, [dispatch, user]);

    const now = new Date();
    const filteredEvents = events.length > 0 && Object.keys(intervals).length > 0
        ? events.filter(event => {
            const interval = intervals[event.intervalId];
            if (!interval?.date || !interval?.endTime) return false;
            const isoDate = interval.date.split("T")[0];
            const endDateTime = new Date(`${isoDate}T${interval.endTime}`);
            if (isNaN(endDateTime.getTime())) return false;
            switch (activeTab) {
                case "upcoming": return endDateTime >= now;
                case "past": return endDateTime < now;
                case "workshop": return event.type === "workshop" && endDateTime >= now;
                case "training": return event.type === "training" && endDateTime >= now;
                default: return true;
            }
        })
        : [];

    const searchedEvents = filteredEvents.filter((event) =>
        `${event.name} ${event.description}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSignUp = async () => {
        try {
            await dispatch(createEmployeeEvent({ employeeId: employee?.id, eventId: modalEvent?.id }));
            await dispatch(getEmployeeEventsByEmployeeId(employee?.id));
            toast.success("Te-ai înscris cu succes!");
        } catch (err) {
            toast.error("Eroare la înscriere.");
        }
        setModalEvent(null);
        setModalType("");
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteEventById(modalEvent?.id));
            await dispatch(updateIntervalStatus({ id: modalEvent.intervalId, status: false }));
            toast.success("Eveniment șters!");
        } catch (err) {
            toast.error("Eroare la ștergere.");
        }
        setModalEvent(null);
        setModalType("");
    };

    const eventDate = modalEvent?.intervalId && intervals[modalEvent.intervalId]?.date
        ? new Date(intervals[modalEvent.intervalId].date).toLocaleDateString("ro-RO")
        : "necunoscută";

    return (
        <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <Navbar />

            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 px-8 pt-8 mb-12">
                <div className="flex flex-wrap items-center gap-6 flex-grow">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Caută evenimente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gradient-to-r from-[#cbc0f3] via-[#cadbf9] to-[#deecff] text-indigo-800 placeholder:text-indigo-600 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-md"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                        </div>
                    </div>

                    {["upcoming", "workshop", "training", "past"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-32 py-2 font-medium rounded-xl backdrop-blur-sm shadow-md transition-all
                                bg-gradient-to-r from-[#cbc0f3] via-[#cadbf9] to-[#deecff] text-indigo-700
                                ${activeTab === tab ? "ring-2 ring-indigo-400" : ""}
                            `}
                        >
                            {{
                                upcoming: "Viitoare",
                                workshop: "Workshop-uri",
                                training: "Training-uri",
                                past: "Trecute",
                            }[tab]}
                        </button>
                    ))}
                </div>

                {user?.role === "specialist" && (
                    <button
                        onClick={() => navigate("/specialist/events/create-event")}
                        className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-2 font-medium rounded-lg backdrop-blur-sm shadow-md flex items-center gap-2"
                    >
                        <FiPlusCircle className="text-lg" />
                        <span>Crează eveniment</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center gap-6 pb-12">
                {searchedEvents.length === 0 ? (
                    <p className="text-indigo-800 text-center">Nu există evenimente care corespund căutării.</p>
                ) : (
                    searchedEvents.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            role={user?.role}
                            employee={employee}
                            index={index}
                            loggedSpecialist={specialist}
                            onRequestSignUp={(ev) => { setModalEvent(ev); setModalType("signUp"); }}
                            onRequestDelete={(ev) => { setModalEvent(ev); setModalType("delete"); }}
                        />
                    ))
                )}
            </div>

            {modalEvent && modalType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-center text-indigo-800">
                            {modalType === "signUp" ? "Confirmare înscriere" : "Confirmare ștergere"}
                        </h2>
                        <p className="text-indigo-700 mb-6 text-center">
                            {modalType === "signUp"
                                ? <>Vrei să te înscrii la evenimentul <strong>{modalEvent?.name}</strong> pe data de <strong>{eventDate}</strong>?</>
                                : <>Sigur vrei să ștergi evenimentul <strong>{modalEvent?.name}</strong>?</>}
                        </p>
                        <div className="flex justify-center gap-4">
                            <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setModalEvent(null)}>Anulează</button>
                            <button
                                className={`px-4 py-2 text-white rounded ${modalType === "signUp" ? "bg-indigo-700 hover:bg-indigo-500" : "bg-red-600 hover:bg-red-700"}`}
                                onClick={modalType === "signUp" ? handleSignUp : handleDelete}
                            >
                                Da, confirmă
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Events;
