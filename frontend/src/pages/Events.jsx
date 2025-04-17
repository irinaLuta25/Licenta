import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { getAllEvents, getAllEventsByTargetDepartment } from "../features/event/eventSlice";
import { getSpecialistByUserId } from "../features/therapists/therapistsSlice"
import { getEmployeeEventsByEmployeeId } from "../features/employeeEvent/employeeEventSlice"
import { getAllIntervals } from "../features/interval/intervalSlice";
import EventCard from "../components/EventCard"


function Events() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("upcoming");

    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const employee = useSelector((state) => state.employee.employee)
    const events = useSelector((state) => state.event.list)
    const specialist = useSelector((state) => state.therapists.selectedTherapist)
    const intervals = useSelector(state => state.interval.intervalsById || {});

    console.log("ALL events:", events);
console.log("INTERVALS:", intervals);


    useEffect(() => {
        const fetchData = async () => {
            if (user?.id && user?.role === "angajat") {
                const res = await dispatch(getEmployeeByUserId(user.id));
                const dept = res.payload?.department;
                if (dept) {
                    await dispatch(getAllEventsByTargetDepartment(dept));
                }
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
    ? events.filter((event) => {
        const interval = intervals[event.intervalId];
        if (!interval || !interval.date || !interval.endTime) return false;

        const isoDate = interval.date.split("T")[0];
        const endDateTime = new Date(`${isoDate}T${interval.endTime}`);
        if (isNaN(endDateTime.getTime())) return false;

        switch (activeTab) {
            case "upcoming":
                return endDateTime >= now;
            case "past":
                return endDateTime < now;
            case "workshop":
                return event.type === "workshop" && endDateTime >= now;
            case "training":
                return event.type === "training" && endDateTime >= now;
            default:
                return true;
        }
    })
    : [];


    console.log("filtered: ",filteredEvents)


    return (
        <div className="bg-[#E0F4EC] min-h-screen">
            <Navbar />

            <div className="flex flex-row m-4 justify-start ml-12">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-row justify-center gap-20 w-full">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`border border-3 rounded-lg border-indigo-400 w-24 pb-2 pt-2
                        ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-black'}`}
                    >
                        Viitoare
                    </button>

                    <button
                        onClick={() => setActiveTab("workshop")}
                        className={`border border-3 rounded-lg border-indigo-400 w-24 pb-2 pt-2
                        ${activeTab === 'workshop' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-black'}`}
                    >
                        Workshops
                    </button>

                    <button
                        onClick={() => setActiveTab("training")}
                        className={`border border-3 rounded-lg border-indigo-400 w-24 pb-2 pt-2
                        ${activeTab === 'training' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-black'}`}
                    >
                        Trainings
                    </button>

                    <button
                        onClick={() => setActiveTab("past")}
                        className={`border border-3 rounded-lg border-indigo-400 w-24 pb-2 pt-2
                        ${activeTab === 'past' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-black'}`}
                    >
                        Trecute
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center gap-6">
                {filteredEvents.map((event, index) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        role={user?.role}
                        employee={employee}
                        index={index}
                        loggedSpecialist={specialist}
                    />
                ))}
            </div>
        </div>
    );
}

export default Events;
