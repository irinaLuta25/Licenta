import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getUserFromCookie } from "../features/auth/authSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeByUserId } from "../features/employee/employeeSlice";
import { getAllEvents, getAllEventsByTargetDepartment } from "../features/event/eventSlice";
import EventCard from "../components/EventCard"


function Events() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    
    const dispatch=useDispatch()
    const user=useSelector((state) => state.auth.user)
    const employee=useSelector((state) => state.employee.employee)
    const events=useSelector((state) => state.event.list)

    console.log("user",user)
    console.log("employeee",employee)
    console.log("events",events)


    useEffect(() => {
        if (user?.id && user?.role === "angajat") {
          dispatch(getEmployeeByUserId(user.id)).then((res) => {
            const dept = res.payload?.department;
            if (dept) {
              dispatch(getAllEventsByTargetDepartment(dept));
            }
          });
        } else if (user?.role === "specialist") {
          dispatch(getAllEvents());
        }
      }, [dispatch, user]);
      
      
      

    const filteredEvents=events.filter((event) => {
        if(activeTab==="all") return true;
        return event.type===activeTab
    })
    console.log("filtered events",filteredEvents)


    return(
        <div className="bg-indigo-200 min-h-screen">
            <Navbar />

            <div className="flex flex-row m-4 justify-start">
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
                    onClick={()=> setActiveTab("all")}
                    className={`border border-3 rounded-lg border-indigo-400 bg-indigo-400 w-24 pb-2 pt-2
                    ${
                    activeTab === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                    All
                    </button>
                    
                    <button
                    onClick={()=> setActiveTab("workshop")}
                    className={`border border-3 rounded-lg border-indigo-400 bg-indigo-400 w-24 pb-2 pt-2
                    ${
                    activeTab === 'workshop' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                    Workshops
                    </button>
                    
                    <button
                    onClick={()=> setActiveTab("training")}
                    className={`border border-3 rounded-lg border-indigo-400 bg-indigo-400 w-24 pb-2 pt-2
                    ${
                    activeTab === 'training' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                    Trainings
                    </button>

                    
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                    {filteredEvents.map((event) => {
                         return <EventCard key={event.id} event={event} role={user?.role} employee={employee} />
                         // ?? cu sau fara return 
                    })}
            </div>

            

        </div>
    )
}

export default Events;