import React, { use, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css'
import './CustomSchedule.css'
import { format } from 'date-fns'
import Navbar from '../components/Navbar'
import FeedbackModal from '../components/FeedbackModal';
import { getSpecialistByUserId, getIntervalsForTherapist } from "../features/therapists/therapistsSlice"
import { getAllTherapySessionsBySpecialistId } from '../features/therapySessions/therapySessionsSlice';
import { getAllEventsBySpecialistId } from '../features/event/eventSlice';
import { createInterval } from '../features/interval/intervalSlice';
import { getEmployeeEventsByEventId } from '../features/employeeEvent/employeeEventSlice';
import { toast } from "react-toastify";
import { useRef } from 'react';


// !! de adus numarul de participani din back (findAndCountAll din EmployeeEvent where eventId)


const SpecialistCalendar = () => {
  const user = useSelector((state) => state.auth.user)
  const specialist = useSelector((state) => state.therapists.loggedInTherapist);
  const freeIntervals = useSelector((state) => state.therapists.freeIntervals);
  const therapySessions = useSelector((state) => state.therapySessions.list);
  const events = useSelector((state) => state.event.list)
  const [participantCounts, setParticipantCounts] = useState({});


  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showModal, setShowModal] = useState(false);
  const [intervalForm, setIntervalForm] = useState({ date: '', beginTime: '', endTime: '' });

  const [selectedFeedbackSession, setSelectedFeedbackSession] = useState(null);


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
  if (therapySessions) {
    therapySessions.forEach(session => {
      if (!session?.interval?.date) return;
      const dateKey = format(new Date(session.interval.date), 'yyyy-MM-dd');
      const begin = session.interval.beginTime.slice(0, 5);
      const end = session.interval.endTime.slice(0, 5);
      realSchedule[dateKey] = realSchedule[dateKey] || [];
      realSchedule[dateKey].push({
        type: 'therapy',
        title: `Therapy Session - ${session.employee.user.firstName} ${session.employee.user.lastName}`,
        time: `${begin}–${end}`,
        original: session
      });
    });
  }

  if (events) {
    events.forEach(event => {
      if (!event?.interval?.date) return;
      const dateKey = format(new Date(event?.interval.date), 'yyyy-MM-dd');
      const begin = event.interval.beginTime.slice(0, 5);
      const end = event.interval.endTime.slice(0, 5);
      realSchedule[dateKey] = realSchedule[dateKey] || [];
      realSchedule[dateKey].push({
        type: 'event',
        title: `${event.type === 'workshop' ? 'Workshop' : 'Training'} - ${event.name}`,
        time: `${begin}–${end}`,
        original: event
      });
    });
  }

  if (freeIntervals) {
    freeIntervals.forEach(interval => {
      if (!interval?.date) return;
      const dateKey = format(new Date(interval.date), 'yyyy-MM-dd');
      const begin = interval.beginTime.slice(0, 5);
      const end = interval.endTime.slice(0, 5);
      realSchedule[dateKey] = realSchedule[dateKey] || [];
      realSchedule[dateKey].push({
        type: 'free',
        title: 'Free slot',
        time: `${begin}–${end}`
      });
    });
  }

  const handleDayClick = (date) => setSelectedDate(date);
  const getEventsForDate = (date) => realSchedule[format(date, 'yyyy-MM-dd')] || [];

  const getColorClass = (ev) => {
    if (ev.type === 'therapy') return 'bg-yellow-100 text-yellow-700';
    if (ev.type === 'event') return ev.title.toLowerCase().includes('workshop') ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
    if (ev.type === 'free') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleAddInterval = () => {
    if (!intervalForm.date || !intervalForm.beginTime || !intervalForm.endTime) return;
    dispatch(createInterval({
      specialistId: specialist.id,
      status: false,
      date: intervalForm.date,
      beginTime: intervalForm.beginTime,
      endTime: intervalForm.endTime
    })).then(() => {
      dispatch(getIntervalsForTherapist(specialist.id));
      setShowModal(false);
      toast.success("Interval Added!");
      setIntervalForm({ date: '', beginTime: '', endTime: '' });
    });
  }

  useEffect(() => {
    if (user?.role === "specialist") dispatch(getSpecialistByUserId(user.id));
  }, [user?.role, user?.id, dispatch]);

  useEffect(() => {
    if (specialist?.id) {
      dispatch(getIntervalsForTherapist(specialist.id));
      if (specialist?.isTherapist === true) {
        dispatch(getAllTherapySessionsBySpecialistId(specialist.id));
      }
      dispatch(getAllEventsBySpecialistId(specialist.id))
    }
  }, [specialist?.id, dispatch]);

  useEffect(() => {
    if (events?.length > 0) {
      events.forEach((ev) => {
        if (ev?.id) {
          dispatch(getEmployeeEventsByEventId(ev.id)).then((res) => {
            setParticipantCounts((prev) => ({
              ...prev,
              [ev.id]: res.payload,
            }));
          });
        }
      });
    }
  }, [events, dispatch]);

  return (
    <div className="pt-16 px-8 sm:px-12 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10 mt-10">

          <div className="lg:w-[55%] w-full p-10 bg-white/30 backdrop-blur-xl border border-white/30 rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-semibold text-indigo-800">My Schedule</h1>
              <button onClick={() => setShowModal(true)} className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 transition">
                + Add Free Slot
              </button>
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

                        {(ev.type === 'event') && (
                          <p className="text-xs text-gray-700 mt-1">
                            Participants: <span className="font-semibold">{participantCounts[ev.original.id] ?? '...'}</span>
                          </p>
                        )}
                      </div>
                      {new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${ev.time.split('–')[1]}`) < new Date() && (
                        <button
                          onClick={() => setSelectedFeedbackSession(ev.original)}
                          className="text-sm bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-500"
                        >
                          See Feedback
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4">Add Free Interval</h2>
            <div className="space-y-3">
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={intervalForm.date}
                onChange={(e) => setIntervalForm({ ...intervalForm, date: e.target.value })}
              />
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={intervalForm.beginTime}
                onChange={(e) => setIntervalForm({ ...intervalForm, beginTime: e.target.value })}
              />
              <input
                type="time"
                className="w-full p-2 border rounded"
                value={intervalForm.endTime}
                onChange={(e) => setIntervalForm({ ...intervalForm, endTime: e.target.value })}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Cancel</button>
                <button onClick={handleAddInterval} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFeedbackSession && (
        <FeedbackModal
          session={selectedFeedbackSession}
          onClose={() => setSelectedFeedbackSession(null)}
        />
      )}
    </div>
  )
}

export default SpecialistCalendar;