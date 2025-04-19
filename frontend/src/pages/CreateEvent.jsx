import React from "react";
import {useNavigate} from 'react-router-dom'

function CreateEvent() {
    const navigate=useNavigate()

  return (
    <div className="bg-gradient-to-br from-[#c1f7dc] via-[#b2d8f3] to-[#c7b5ff] backdrop-blur-lg min-h-screen">
        <div className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <button
                    onClick={() => navigate(-1)}
                    className="text-2xl font-bold hover:underline"
                >
                    ← Back
                </button>
        </div>
        
        <div>

        </div>
      <h1 className="text-3xl font-bold text-indigo-800">Create a New Event</h1>

    </div>
  );
}

export default CreateEvent;
