import React, { use, useEffect, useState } from "react";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./CustomSchedule.css";
import { format } from "date-fns";
import Navbar from "../components/Navbar";
import { getAllTherapySessionsByEmployeeId } from "../features/therapySessions/therapySessionsSlice";
import { getEmployeeEventsByEmployeeId } from "../features/employeeEvent/employeeEventSlice";
import { toast } from "react-toastify";
import { useRef } from "react";
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { deleteTherapySession } from "../features/therapySessions/therapySessionsSlice";
import { updateIntervalStatus } from "../features/interval/intervalSlice";
import { deleteEmployeeEvent } from "../features/employeeEvent/employeeEventSlice";
import { checkHasFeedbackForEvent, checkHasFeedbackForTherapySession } from "../features/answer/answerSlice"


const EmployeeSchedule = () => {
    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);
    const therapySessions = useSelector((state) => state.therapySessions.list);
    const events = useSelector((state) => state.employeeEvent.employeeEvents);
    const feedbackStatus = useSelector((state) => state.answer.feedbackStatus);


    console.log(employee);
    console.log("events", events);
    console.log("therapy", therapySessions);

    const dispatch = useDispatch();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [intervalForm, setIntervalForm] = useState({
        date: "",
        beginTime: "",
        endTime: "",
    });
    const [selectedToDelete, setSelectedToDelete] = useState(null);

    const handleDelete = (ev) => {
        setSelectedToDelete(ev);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (!selectedToDelete) return;

        if (selectedToDelete.type === "therapy") {
            const intervalId = selectedToDelete.original.intervalId;
            const therapySessionId = selectedToDelete.original.id;

            dispatch(deleteTherapySession(therapySessionId))
                .unwrap()
                .then(() => {
                    dispatch(updateIntervalStatus({
                        id: intervalId,
                        status: false
                    }));
                    toast.success("Therapy session canceled!");
                })
                .catch(() => toast.error("Failed to cancel therapy session."));
        } else if (selectedToDelete.type === "event") {
            const employeeEventId = selectedToDelete.original.id;

            dispatch(deleteEmployeeEvent(employeeEventId))
                .unwrap()
                .then(() => {
                    toast.success("Unregistered from event!");
                })
                .catch(() => toast.error("Failed to unregister from event."));
        }

        setShowModal(false);
        setSelectedToDelete(null);
    };




    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showModal &&
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                setShowModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showModal]);

    const realSchedule = {};

    if (therapySessions) {
        therapySessions.forEach((session) => {
            if (!session?.interval?.date) return;
            const dateKey = format(new Date(session.interval.date), "yyyy-MM-dd");
            const begin = session.interval.beginTime.slice(0, 5);
            const end = session.interval.endTime.slice(0, 5);
            realSchedule[dateKey] = realSchedule[dateKey] || [];
            realSchedule[dateKey].push({
                type: "therapy",
                title: `Therapy Session - ${session.interval.specialist?.user?.firstName || "Specialist"
                    } ${session.interval.specialist?.user?.lastName || ""}`,
                time: `${begin}–${end}`,
                original: session,
            });
        });
    }

    if (events) {
        events.forEach((employeeEvent) => {
            const event = employeeEvent.event;
            if (!event?.interval?.date) return;
            const dateKey = format(new Date(event.interval.date), "yyyy-MM-dd");
            const begin = event.interval.beginTime.slice(0, 5);
            const end = event.interval.endTime.slice(0, 5);
            realSchedule[dateKey] = realSchedule[dateKey] || [];
            realSchedule[dateKey].push({
                type: "event",
                title: `${event.name} - ${event.interval?.specialist?.user?.firstName || "Specialist"
                    } ${event.interval?.specialist?.user?.lastName || ""}`,
                time: `${begin}–${end}`,
                original: employeeEvent,
            });
        });
    }


    const handleDayClick = (date) => setSelectedDate(date);
    const getEventsForDate = (date) =>
        realSchedule[format(date, "yyyy-MM-dd")] || [];

    const getColorClass = (ev) => {
        if (ev.type === "therapy") return "bg-yellow-100 text-yellow-700";
        if (ev.type === "event")
            return ev.title.toLowerCase().includes("workshop")
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800";
        return "bg-gray-100 text-gray-800";
    };

    useEffect(() => {
        if (user?.role === "angajat") dispatch(getEmployeeByUserId(user.id));
    }, [user?.role, user?.id, dispatch]);

    useEffect(() => {
        if (employee?.id) {
            dispatch(getAllTherapySessionsByEmployeeId(employee.id));
            dispatch(getEmployeeEventsByEmployeeId(employee.id));
        }
    }, [employee?.id, dispatch]);

    useEffect(() => {
        if (employee?.id) {
            therapySessions.forEach((session) => {
                dispatch(checkHasFeedbackForTherapySession({ therapySessionId: session.id, employeeId: employee.id }));
            });
            events.forEach((employeeEvent) => {
                dispatch(checkHasFeedbackForEvent({ eventId: employeeEvent.event.id, employeeId: employee.id }));
            });
        }
    }, [employee?.id, therapySessions, events, dispatch]);


    return (
        <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <Navbar></Navbar>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    <div className="lg:w-[55%] w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-indigo-800">
                                My Schedule
                            </h1>
                        </div>

                        <Calendar
                            className="custom-schedule-calendar"
                            onClickDay={handleDayClick}
                            value={selectedDate}
                            tileContent={({ date }) => {
                                const events = getEventsForDate(date);
                                return (
                                    <div className="flex flex-wrap justify-center gap-[2px] mt-1 max-w-full">
                                        {events.slice(0, 3).map((ev, idx) => (
                                            <div
                                                key={idx}
                                                className={`text-[9px] px-1 rounded whitespace-nowrap truncate max-w-[40px] font-medium ${getColorClass(
                                                    ev
                                                )}`}
                                            >
                                                {ev.title}
                                            </div>
                                        ))}
                                        {events.length > 3 && (
                                            <span className="text-[9px] text-gray-200">
                                                +{events.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                );
                            }}
                        />
                    </div>

                    <div className="lg:w-[45%] w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                            {format(selectedDate, "MMMM dd, yyyy")}
                        </h2>
                        <div className="space-y-3">
                            {getEventsForDate(selectedDate).length === 0 ? (
                                <p className="text-gray-600 italic text-center">
                                    No activities scheduled.
                                </p>
                            ) : (
                                getEventsForDate(selectedDate).map((ev, idx) => {
                                    const eventEndDate = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${ev.time.split("–")[1]}`);
                                    const isPast = eventEndDate < new Date();

                                    const hasFeedback =
                                        ev.type === "therapy"
                                            ? feedbackStatus[`therapy-${ev.original?.id}`]
                                            : ev.type === "event"
                                                ? feedbackStatus[`event-${ev.original?.event?.id}`]
                                                : false;

                                    return (
                                        <div key={idx} className={`p-4 rounded shadow-sm ${getColorClass(ev)}`}>
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                <div>
                                                    <span className="font-medium block">{ev.title}</span>
                                                    <span className="text-sm block">{ev.time}</span>
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    {isPast ? (
                                                        <Link
                                                            to={
                                                                ev?.type === "therapy"
                                                                    ? `/employee/schedule/therapySession/${ev?.original?.id}`
                                                                    : `/employee/schedule/event/${ev?.original?.event?.id}`
                                                            }
                                                            className={`text-sm ${hasFeedback
                                                                    ? 'bg-gray-400 cursor-not-allowed pointer-events-none'
                                                                    : 'bg-purple-400 hover:bg-purple-500'
                                                                } text-white px-3 py-2 rounded`}
                                                        >
                                                            {hasFeedback ? 'Feedback Added' : 'Add Feedback'}
                                                        </Link>


                                                    ) : (
                                                        <button
                                                            onClick={() => handleDelete(ev)}
                                                            className="text-sm bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                                                        >
                                                            {ev.type === "therapy" ? "Cancel Session" : "Unregister"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showModal && selectedToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div ref={modalRef} className="bg-white rounded-xl p-8 shadow-xl max-w-md w-full text-center space-y-4">
                        <h3 className="text-xl font-semibold text-indigo-800">
                            {selectedToDelete.type === "therapy" ? "Cancel Therapy Session?" : "Unregister from Event?"}
                        </h3>
                        <p className="text-gray-600">
                            Are you sure you want to {selectedToDelete.type === "therapy" ? "cancel this therapy session" : "unregister from this event"}?
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Yes, Confirm
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default EmployeeSchedule;
