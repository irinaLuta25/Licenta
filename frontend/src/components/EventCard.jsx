import React from "react";

function EventCard({event,role,employee}) {
    const canSignUp = (role === "employee" && employee?.isManager===false)
                       || (role==="employee" && employee?.isManager===true && event.isManagerParticipant===true)
                        || false;
    
    const isCreator = (role === "specialist") // si daca event.specialistId === id-ul specialistului logat (tre sa il iei dupa id-ul userului intr un async thunk)

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold">{event.title}</h2>
          <p className="text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500">Tip: {event.type}</p>
    
          {canSignUp && (
            <button className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded" >
              Înscrie-te
            </button>
          )}
    
          {isCreator && (
            <button className="mt-2 ml-2 bg-red-500 text-white px-3 py-1 rounded">
              Șterge
            </button>
          )}
        </div>
    );
}

export default EventCard;