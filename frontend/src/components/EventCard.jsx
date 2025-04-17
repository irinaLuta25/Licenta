import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getIntervalById } from "../features/interval/intervalSlice";
import { getTherapistById } from "../features/therapists/therapistsSlice";
import { createEmployeeEvent, getEmployeeEventsByEmployeeId } from "../features/employeeEvent/employeeEventSlice";
import { deleteEventById } from "../features/event/eventSlice";
import { updateIntervalStatus } from "../features/interval/intervalSlice";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function EventCard({ event, role, employee, index }) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const specialists = useSelector((state) => state.therapists.specialistsById);
    const loggedInSpecialist = useSelector((state) => state.therapists.loggedInTherapist);
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
        endDateTime.setMilliseconds(0);

        return new Date() > endDateTime;
    }, [interval]);

    const isEnrollmentClosed = new Date() > formattedDate;
    const layoutClass = index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse";
    const facilitator = specialists?.[event.specialistId];

    const canSignUp =
        role === "angajat" &&
        (!employee?.isManager || (employee?.isManager && event?.managerIsParticipant));

    const isCreator =
        role === "specialist" &&
        loggedInSpecialist?.id === event?.specialistId;

    const handleSignUp = async () => {
        try {
            await dispatch(createEmployeeEvent({ employeeId: employee?.id, eventId: event?.id }));
            await dispatch(getEmployeeEventsByEmployeeId(employee?.id));
        } catch (err) {
            console.error("Eroare la înscriere:", err);
        }
    };

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const confirmDelete = async () => {
        try {
          await dispatch(deleteEventById(event?.id));
          await dispatch(updateIntervalStatus({ id: event.intervalId, status: false }));
          toast.success("Evenimentul a fost șters cu succes!");
          setDeleteModalOpen(false);
        } catch (err) {
          toast.error("Eroare la ștergerea evenimentului.");
        }
    };
      


    const facilitatorUser = facilitator?.user;

    return (
        <div className={`w-full max-w-6xl mx-auto flex flex-col ${layoutClass} items-center justify-between gap-6 bg-indigo-200 text-black rounded-2xl shadow-md border border-indigo-200 p-6 my-6`}>
            <div className="w-full md:w-1/2 flex justify-center">
                <img src="/assets/workshop.png" alt="Event" className="rounded-xl object-cover max-h-72 w-full md:max-w-md" />
            </div>

            <div className="w-full md:w-1/2">
                <div className="flex flex-row gap-6">
                    <h2 className="text-2xl font-semibold">{event.name}</h2>
                    <div className="flex gap-4 items-center justify-end mt-2 text-sm text-gray-700">
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {eventDate.toLocaleDateString("ro-RO")}</span>
                        <span className="flex items-center gap-1"><FaClock /> {interval?.beginTime?.slice(0, 5)} - {interval?.endTime?.slice(0, 5)}</span>
                    </div>
                </div>

                <p className="text-sm mb-4 leading-relaxed break-words">{event.description}</p>

                <p className="text-sm text-gray-700 mb-4">
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
                                <button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md" onClick={() => setShowModal(true)}>Sign up</button>
                            )
                        )}

                        {isCreator && !isEventPast && (
                            <button
                                className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                onClick={() => setDeleteModalOpen(true)}
                            >
                                Delete
                            </button>
                        )}

                    </div>

                    <p className="text-sm text-gray-500 mt-2 md:mt-0">Registration closes on: {formattedDate.toLocaleDateString("ro-RO")}</p>
                </div>

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-4 text-center">Confirmare înscriere</h2>
                            <p className="text-gray-700 mb-6 text-center">
                                Vrei să te înscrii la evenimentul <strong>{event?.name}</strong> pe data de <strong>{eventDate.toLocaleDateString("ro-RO")}</strong>?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowModal(false)}>Anulează</button>
                                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={() => { handleSignUp(); setShowModal(false); }}>Da, confirmă</button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-xl font-bold mb-4 text-center text-red-600">Confirmare ștergere</h2>
                            <p className="text-gray-700 mb-6 text-center">
                                Sigur vrei să ștergi evenimentul <strong>{event.name}</strong>?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setDeleteModalOpen(false)}
                                >
                                    Anulează
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    onClick={confirmDelete}
                                >
                                    Da, șterge
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
