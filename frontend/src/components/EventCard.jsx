import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIntervalById } from "../features/interval/intervalSlice";
import { getTherapistById } from "../features/therapists/therapistsSlice";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

function EventCard({ event, role, employee, index, loggedSpecialist, onRequestSignUp, onRequestDelete }) {
    const dispatch = useDispatch();
    const specialists = useSelector((state) => state.therapists.specialistsById);
    const interval = useSelector((state) => state.interval.intervalsById?.[event.intervalId]);
    const employeeEvents = useSelector((state) => state.employeeEvent.employeeEvents || []);
    const isSignedUp = employeeEvents.some(ev => ev.eventId === event.id);

    useEffect(() => {
        const specialist = specialists?.[event.specialistId];
        if (event?.specialistId && (!specialist || !specialist.user)) {
            dispatch(getTherapistById(event.specialistId));
        }
        if (event?.intervalId && !interval) {
            dispatch(getIntervalById(event.intervalId));
        }
    }, [event?.specialistId, event?.intervalId, specialists, interval, dispatch]);

    const formattedDate = useMemo(() => new Date(event.enrollmentDeadline), [event.enrollmentDeadline]);

    const eventDate = useMemo(() => {
        return interval?.date ? new Date(interval.date) : new Date();
    }, [interval?.date]);

    const isEventPast = useMemo(() => {
        if (!interval?.date || !interval?.endTime) return false;
        const baseDate = new Date(interval.date);
        const [hours, minutes] = interval.endTime.split(":");
        const endDateTime = new Date(baseDate);
        endDateTime.setHours(Number(hours));
        endDateTime.setMinutes(Number(minutes));
        endDateTime.setSeconds(0);
        return new Date() > endDateTime;
    }, [interval]);

    const isEnrollmentClosed = new Date() > formattedDate;
    const layoutClass = index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse";
    const facilitator = specialists?.[event.specialistId];
    const facilitatorUser = facilitator?.user;

    const canSignUp =
        role === "angajat" &&
        (!employee?.isManager || (employee?.isManager && event?.managerIsParticipant));

    const isCreator =
        role === "specialist" &&
        loggedSpecialist?.id === event?.specialistId;

    return (
        <div className={`w-full max-w-6xl mx-auto flex flex-col ${layoutClass} items-center justify-between gap-6 text-indigo-900 rounded-2xl bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 border border-indigo-300/30 backdrop-blur-xl shadow-xl hover:shadow-2xl transition transform duration-300 hover:-translate-y-1 p-6 my-6`}>
            {event.image && (
                <div className="w-full md:w-1/2 flex justify-center">
                    <img src={event.image} alt="Event" className="rounded-xl object-cover max-h-72 w-full md:max-w-md" />
                </div>
            )}

            <div className="w-full md:w-1/2">
                <div className="flex flex-row gap-6">
                    <h2 className="text-2xl font-semibold">{event.name}</h2>
                    <div className="flex gap-4 items-center justify-end mt-2 text-sm text-indigo-800">
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {eventDate.toLocaleDateString("ro-RO")}</span>
                        <span className="flex items-center gap-1"><FaClock /> {interval?.beginTime?.slice(0, 5)} - {interval?.endTime?.slice(0, 5)}</span>
                    </div>
                </div>

                <p className="text-sm mb-4 leading-relaxed break-words">{event.description}</p>

                <p className="text-sm text-indigo-800 mb-4">
                    <b>Facilitator:</b>{" "}
                    {facilitatorUser?.firstName} {facilitatorUser?.lastName}
                    {facilitator && (
                        <Link to={`/therapists/${facilitator?.id}`} className="ml-2 text-indigo-700 hover:underline font-medium">
                            {facilitator?.firstName} {facilitator?.lastName}
                        </Link>
                    )}
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                        {canSignUp && (
                            isEventPast ? (
                                <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-md" disabled>Event ended</button>
                            ) : isEnrollmentClosed ? (
                                <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded-md" disabled>Sign-up ended</button>
                            ) : isSignedUp ? (
                                <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md" disabled>Signed up</button>
                            ) : (
                                <button className="mt-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md" onClick={() => onRequestSignUp(event)}>Sign up</button>
                            )
                        )}

                        {isCreator && !isEventPast && (
                            <button
                                className="mt-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md"
                                onClick={() => onRequestDelete(event)}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    <p className="text-sm text-indigo-800 mt-2 md:mt-0">Registration closes on: {formattedDate.toLocaleDateString("ro-RO")}</p>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
