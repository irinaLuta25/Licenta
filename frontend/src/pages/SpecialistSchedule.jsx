import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './CustomSchedule.css'
import { format } from 'date-fns'
import Navbar from '../components/Navbar'

const SpecialistCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const mockSchedule = {
    '2025-05-03': [
      { type: 'therapy', title: 'Therapy - Ana', time: '09:00' },
      { type: 'event', title: 'Workshop - Stress Relief', time: '14:00' },
      { type: 'free', title: 'Free slot', time: '10:00–11:00' },
      { type: 'free', title: 'Free slot', time: '15:00–16:00' }
    ]
  }

  const handleDayClick = (date) => {
    setSelectedDate(date)
  }

  const getEventsForDate = (date) => {
    const formatted = format(date, 'yyyy-MM-dd')
    return mockSchedule[formatted] || []
  }

  return (
    <div className="bg-gradient-to-br from-[#c1f7dc] via-[#b2d8f3] to-[#c7b5ff] backdrop-blur-lg min-h-screen pb-10">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
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
                        className={`text-[9px] px-1 rounded whitespace-nowrap truncate max-w-[40px] font-medium ${
                          ev.type === 'therapy'
                            ? 'bg-blue-100 text-blue-800'
                            : ev.type === 'event'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
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
              {getEventsForDate(selectedDate).map((ev, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded flex justify-between items-center shadow-sm ${
                    ev.type === 'therapy'
                      ? 'bg-blue-100 text-blue-800'
                      : ev.type === 'event'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}
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