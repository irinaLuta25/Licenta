import React, { use, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css'
import './CustomSchedule.css'
import { format } from 'date-fns'
import Navbar from '../components/Navbar'
import FeedbackModal from '../components/FeedbackModal';
import { getAllTherapySessionsByEmployeeId } from '../features/therapySessions/therapySessionsSlice';
import { createInterval } from '../features/interval/intervalSlice';
import { getEmployeeEventsByEmployeeId } from '../features/employeeEvent/employeeEventSlice';
import { toast } from "react-toastify";
import { useRef } from 'react';
import { getEmployeeByUserId } from '../features/employee/employeeSlice';

// to do:
// verifica daca apare butonul cand trebuie
// sa primeasca userul notificare cand apare un formular de feedback la care a fost
// la fiecare therapy session: buton de cancel, la fiecare event: unregister
// partea cealalta este notoficata de schimbare!!!
// click pe addFeedback => se deschide formular de feedback

const EmployeeSchedule = () => {
    const user = useSelector((state) => state.auth.user)
    const employee = useSelector((state) => state.employee.employee);
    const therapySessions = useSelector((state) => state.therapySessions.list);
    const events = useSelector((state) => state.employeeEvent.employeeEvents)

    console.log(employee)
    console.log("events",events)
    console.log("therapy",therapySessions)

    const dispatch = useDispatch();

    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showModal, setShowModal] = useState(false);
    const [intervalForm, setIntervalForm] = useState({ date: '', beginTime: '', endTime: '' });


    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal]);

    const realSchedule = {};

// Adaugă therapySessions în realSchedule
if (therapySessions) {
    therapySessions.forEach(session => {
        if (!session?.interval?.date) return;
        const dateKey = format(new Date(session.interval.date), 'yyyy-MM-dd');
        const begin = session.interval.beginTime.slice(0, 5);
        const end = session.interval.endTime.slice(0, 5);
        realSchedule[dateKey] = realSchedule[dateKey] || [];
        realSchedule[dateKey].push({
            type: 'therapy',
            title: `Therapy Session - ${session.specialist?.user?.firstName || 'Specialist'} ${session.specialist?.user?.lastName || ''}`,
            time: `${begin}–${end}`,
            original: session
        });
    });
}

if (events) {
    events.forEach(event => {
        if (!event?.event?.interval?.date) return;
        const dateKey = format(new Date(event.event.interval.date), 'yyyy-MM-dd');
        const begin = event.event.interval.beginTime.slice(0, 5);
        const end = event.event.interval.endTime.slice(0, 5);
        realSchedule[dateKey] = realSchedule[dateKey] || [];
        realSchedule[dateKey].push({
            type: 'event',
            title: `${event.event.name}`,
            time: `${begin}–${end}`,
            original: event
        });
    });
}

    const handleDayClick = (date) => setSelectedDate(date);
        const getEventsForDate = (date) => realSchedule[format(date, 'yyyy-MM-dd')] || [];

        const getColorClass = (ev) => { 
            if (ev.type === 'therapy') return 'bg-yellow-100 text-yellow-700';
            if (ev.type === 'event') return ev.title.toLowerCase().includes('workshop') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
            return 'bg-gray-100 text-gray-800';
        };

        useEffect(() => {
            if (user?.role === "angajat") dispatch(getEmployeeByUserId(user.id));
        }, [user?.role, user?.id, dispatch]);

          useEffect(() => {
            if (employee?.id) {
              dispatch(getAllTherapySessionsByEmployeeId(employee.id))
              dispatch(getEmployeeEventsByEmployeeId(employee.id))
            }
          }, [employee?.id, dispatch]);

    return (
        <div className="pt-24 px-8 sm:px-16 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
            <Navbar></Navbar>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-10 mt-10">

                    <div className="lg:w-[55%] w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <h1 className="text-3xl font-semibold text-indigo-800">My Schedule</h1>
                        </div>

                        <Calendar
                            className="custom-schedule-calendar"
                            onClickDay={handleDayClick}
                            value={selectedDate}
                            tileContent={({ date }) => {
                                const events = getEventsForDate(date)
                                return (
                                    <div className="flex flex-wrap justify-center gap-[2px] mt-1 max-w-full">
                                        {events.slice(0, 3).map((ev, idx) => (
                                            <div key={idx} className={`text-[9px] px-1 rounded whitespace-nowrap truncate max-w-[40px] font-medium ${getColorClass(ev)}`}>
                                                {ev.title}
                                            </div>
                                        ))}
                                        {events.length > 3 && <span className="text-[9px] text-gray-200">+{events.length - 3} more</span>}
                                    </div>
                                )
                            }}
                        />
                    </div>

                    <div className="lg:w-[45%] w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">{format(selectedDate, 'MMMM dd, yyyy')}</h2>
                        <div className="space-y-3">
                            {getEventsForDate(selectedDate).length === 0 ? (
                                <p className="text-gray-600 italic text-center">No activities scheduled.</p>
                            ) : (
                                getEventsForDate(selectedDate).map((ev, idx) => (
                                    <div key={idx} className={`p-4 rounded shadow-sm ${getColorClass(ev)}`}>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                            <div>
                                                <span className="font-medium block">{ev.title}</span>
                                                <span className="text-sm block">{ev.time}</span>

                                            </div>
                                            {new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${ev.time.split('–')[1]}`) < new Date() && (
                                                <button
                                                    // onClick={() => setSelectedFeedbackSession(ev.original)}
                                                    className="text-sm bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-500"
                                                >
                                                    Add Feedback
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    )
}

export default EmployeeSchedule;
