import React, { use, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { useDispatch, useSelector } from 'react-redux';
import 'react-calendar/dist/Calendar.css'
import './CustomSchedule.css'
import { format } from 'date-fns'
import Navbar from '../components/Navbar'
import { getSpecialistByUserId, getIntervalsForTherapist } from "../features/therapists/therapistsSlice"
import { getAllTherapySessionsBySpecialistId } from '../features/therapySessions/therapySessionsSlice';
import { getAllEventsBySpecialistId } from '../features/event/eventSlice';

// la click pe details: afisam toate detaliile programarii + luam intrebare si raspunsuri (anonime si nu) pt feedback! 
// nu exista feedback => mesaj. altfel avem intrebare - lista nume cu raspunsuri
// createFreeInterval - asta facem cu modala la click pe buton


const SpecialistCalendar = () => {
  const user = useSelector((state) => state.auth.user)
  const specialist = useSelector((state) => state.therapists.loggedInTherapist);
  const freeIntervals = useSelector((state) => state.therapists.freeIntervals);
  const therapySessions = useSelector((state) => state.therapySessions.list);
  const events = useSelector((state) => state.event.list)

  console.log("specialist", specialist)
  console.log("free intervals: ", freeIntervals)
  console.log("therapySessions: ", therapySessions)
  console.log("events: ", events)

  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(new Date())

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
        time: `${begin}–${end}`
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
        time: `${begin}–${end}`
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



  const handleDayClick = (date) => {
    setSelectedDate(date)
  }

  const getEventsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd')
    return realSchedule[formatted] || []
  }

  const getColorClass = (ev) => {
    if (ev.type === 'therapy') {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (ev.type === 'event') {
      if (ev.title.toLowerCase().includes('workshop')) {
        return 'bg-purple-100 text-purple-800';
      } else {
        return 'bg-blue-100 text-blue-800';
      }
    }
    if (ev.type === 'free') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };


  useEffect(() => {
    if (user?.role === "specialist") {
      dispatch(getSpecialistByUserId(user.id));
    }
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




  return (
    <div className="pt-16 px-8 sm:px-12 bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left side: Calendar + header */}
          <div className="lg:w-[55%] w-full bg-[#ffe6e0] p-6 border border-indigo-300/30 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-semibold text-indigo-800">My Schedule</h1>
              <button className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 transition">
                + Add Free Interval
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
                      <div
                        key={idx}
                        className={`text-[9px] px-1 rounded whitespace-nowrap truncate max-w-[40px] font-medium  ${getColorClass(ev)}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {events.length > 3 && (
                      <span className="text-[9px] text-gray-200">+{events.length - 3} more</span>
                    )}
                  </div>
                )
              }}
            />
          </div>

          {/* Right side: Details */}
          <div className="lg:w-[45%] w-full bg-[#ffe6e0] p-6 border border-indigo-300/30 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-indigo-800 mb-4">
              {format(selectedDate, 'MMMM dd, yyyy')}
            </h2>
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ?
                (
                  <p className="text-gray-600 italic text-center">No activities scheduled.</p>
                ) :
                getEventsForDate(selectedDate).map((ev, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded flex justify-between items-center shadow-sm  ${getColorClass(ev)}`}
                  >
                    <span className="font-medium">{ev.title}</span>
                    <span className="text-sm">{ev.time}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialistCalendar;