import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTherapistById } from "../features/therapists/therapistsSlice";
import { createEmployeeEvent, getEmployeeEventsByEmployeeId } from "../features/employeeEvent/employeeEventSlice";
import { getUserById } from "../features/user/userSlice";
import { getIntervalById } from "../features/interval/intervalSlice";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

// to do: implement delete, create event button, finish searchBar, + perspectiva de manager - sign up repara 
// nice to have: sortare evenimente dupa data - cele mai curente primele


function EventCard({ event, role, employee, index, loggedSpecialist }) {
    const dispatch = useDispatch();
    const specialist = useSelector((state) => state.therapists.selectedTherapist);
    const { status, error } = useSelector(state => state.employeeEvent);
    const employeeEvents = useSelector((state) => state.employeeEvent.employeeEvents || []);
    const isSignedUp = employeeEvents.some(ev => ev.eventId === event.id);
    const userForSpecialist = useSelector(state => state.user.usersById?.[event.specialistId]);
    const interval = useSelector((state) => state.interval.intervalsById?.[event.intervalId]);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (event?.specialistId) {
            dispatch(getTherapistById(event.specialistId));
            dispatch(getUserById(event.specialistId));
        }
        if (event?.intervalId) {
            dispatch(getIntervalById(event.intervalId));
        }
    }, [event?.specialistId, dispatch]);

    let canSignUp = false;
    if (role === "angajat") {
        if (employee?.isManager === false) {
            canSignUp = true;
        } else if (employee?.isManager === true && event?.isManagerParticipant === true) {
            canSignUp = true;
        }
    }

    const isCreator = (role === "specialist") && (event?.specialistId === loggedSpecialist?.id);

    const formattedDate = new Date(event.enrollmentDeadline);
    const eventDate = new Date(interval?.date);
    const endDateTime = new Date(`${interval?.date}T${interval?.endTime}`);
    const isEnrollmentClosed = new Date() > formattedDate;
    const isEventPast = new Date() > endDateTime;

    const handleSignUp = async () => {
        try {
            await dispatch(createEmployeeEvent({
                employeeId: employee?.id,
                eventId: event?.id
            }));
            await dispatch(getEmployeeEventsByEmployeeId(employee?.id));
        } catch (err) {
            console.error("Eroare la înscriere:", err);
        }
    };

    const layoutClass = index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse";

    return (
        <div className={`w-full max-w-6xl mx-auto flex flex-col ${layoutClass} items-center justify-between gap-6 bg-indigo-200 text-black rounded-2xl shadow-md border border-indigo-200 p-6 my-6`}>
            <div className="w-full md:w-1/2 flex justify-center">
                <img
                    src="/assets/workshop.png"
                    alt="Event"
                    className="rounded-xl object-cover max-h-72 w-full md:max-w-md"
                />
            </div>

            <div className="w-full md:w-1/2">
                <div className="flex flex-row gap-6">
                    <h2 className="text-2xl font-semibold">{event.name}</h2>
                    <div className="flex gap-4 items-center justify-end mt-2 text-sm text-gray-700">
                        <span className="flex items-center gap-1">
                            <FaCalendarAlt /> {eventDate.toLocaleDateString("ro-RO")}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaClock /> {interval?.beginTime.slice(0, 5)} - {interval?.endTime.slice(0, 5)}
                        </span>
                    </div>
                </div>

                <p className="text-sm mb-4 leading-relaxed break-words">{event.description}</p>

                <p className="text-sm text-gray-700 mb-4">
                    <b>Facilitator:</b> {userForSpecialist?.firstName} {userForSpecialist?.lastName}
                    <Link
                        to={`/therapists/${specialist?.id}`}
                        className="text-indigo-700 hover:underline font-medium"
                    >
                        {specialist?.firstName} {specialist?.lastName}
                    </Link>
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                        {canSignUp && (
                            isEventPast ? (
                                <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-md transition cursor-default" disabled>
                                    Event ended
                                </button>
                            ) : isEnrollmentClosed ? (
                                <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-md transition cursor-default" disabled>
                                    Sign-up ended
                                </button>
                            ) : isSignedUp ? (
                                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md transition cursor-default" disabled>
                                    Signed up
                                </button>
                            ) : (
                                <button
                                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                                    onClick={() => setShowModal(true)}
                                >
                                    Sign up
                                </button>
                            )
                        )}

                        {isCreator && (
                            <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
                                Delete
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-gray-500 mt-2 md:mt-0">
                        Registration closes on: {formattedDate.toLocaleDateString("ro-RO")}
                    </p>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-4 text-center">Confirmare înscriere</h2>
                            <p className="text-gray-700 mb-6 text-center">
                                Vrei să te înscrii la evenimentul <strong>{event?.name}</strong> pe data de{" "}
                                <strong>{eventDate.toLocaleDateString("ro-RO")}</strong>?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setShowModal(false)}
                                >
                                    Anulează
                                </button>
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                    onClick={() => {
                                        handleSignUp();
                                        setShowModal(false);
                                    }}
                                >
                                    Da, confirmă
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventCard;
