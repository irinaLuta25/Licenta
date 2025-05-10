import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { getAllEvents, getAllEventsByTargetDepartment } from "../features/event/eventSlice";
import { getSpecialistByUserId } from "../features/therapists/therapistsSlice";
import { getEmployeeEventsByEmployeeId } from "../features/employeeEvent/employeeEventSlice";
import { getAllIntervals } from "../features/interval/intervalSlice";
import EventCard from "../components/EventCard";
import { FiPlusCircle } from "react-icons/fi";

function Events() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

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

    return (
        <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <Navbar />

            <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 px-8 pt-8 mb-12">
                <div className="flex flex-wrap items-center gap-6 flex-grow">
                    <div className="relative w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search events..."
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
                                upcoming: "Upcoming",
                                workshop: "Workshops",
                                training: "Trainings",
                                past: "Past",
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
                        <span>Create Event</span>
                    </button>
                )}
            </div>

            <div className="flex flex-col items-center gap-6 px-4 pb-12">
                {searchedEvents.length === 0 ? (
                    <p className="text-indigo-800 text-center">No events match your search.</p>
                ) : (
                    searchedEvents.map((event, index) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            role={user?.role}
                            employee={employee}
                            index={index}
                            loggedSpecialist={specialist}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default Events;
