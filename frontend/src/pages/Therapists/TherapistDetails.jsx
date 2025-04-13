import { React, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { getTherapistById, getIntervalsForTherapist } from "../../features/therapists/therapistsSlice";
import { createTherapySession, resetTherapySessionStatus } from "../../features/therapySessions/therapySessionsSlice"
import { getEmployeeByUserId } from "../../features/employee/employeeSlice";
import { updateIntervalStatus} from "../../features/interval/intervalSlice"
import { useDispatch, useSelector } from "react-redux";
import { FaLinkedin, FaFacebook, FaGlobe, FaPhone, FaEnvelope } from "react-icons/fa";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';


function TherapistDetails() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedInterval, setSelectedInterval] = useState(null)
    const [showModal, setShowModal] = useState(false);

    const { id } = useParams();
    console.log("id: ", id)

    const dispatch = useDispatch();

    const therapist = useSelector((state) => state.therapists.selectedTherapist)
    const status = useSelector((state) => state.therapists.status)
    const error = useSelector((state) => state.therapists.error)

    const freeIntervals = useSelector((state) => state.therapists.freeIntervals)

    const user = useSelector((state) => state.auth.user);
    const employee = useSelector((state) => state.employee.employee);

    const success = useSelector((state) => state.therapySessions.success);


    console.log("user: ", user)
    console.log("employee: ", employee)

    const navigate = useNavigate();


    useEffect(() => {
        if (status === "idle") {
            dispatch(getTherapistById(id));
            dispatch(getIntervalsForTherapist(id));
        }
    }, [dispatch, id, status]);


    useEffect(() => {
        if (user?.id) {
            console.log("USER din useEffect:", user);
            dispatch(getEmployeeByUserId(user.id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (success) {
          toast.success("Programare efectuată cu succes!");
          dispatch(resetTherapySessionStatus());
        }
      }, [success, dispatch]);


    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Error: {error}</p>;
    if (status === "idle" || !therapist) return <p>Nu există date.</p>;


    const calculateAge = (birthdate) => {
        if (!birthdate) return null;
        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    let age = "";
    if (therapist.user?.birthdate) {
        age = calculateAge(therapist.user?.birthdate);
    }

    let specializations = [];
    if (therapist.specialist_specializations) {
        specializations = therapist.specialist_specializations?.map(s => s.specialization?.name).join(', ');
    }

    console.log("Therapist " + id + ":", therapist)
    console.log(freeIntervals)

    const availableDates = freeIntervals.map(interval => new Date(interval.date).toDateString())

    const selectedDateString = selectedDate.toDateString()
    const intervalsForSelectedDate = freeIntervals.filter(interval => {
        const intervalDateString = new Date(interval.date).toDateString()
        return intervalDateString === selectedDateString
    })



    return (
        <>
            

            <div className="bg-indigo-700 text-white px-6 py-3 flex justify-between items-center shadow-md">
                <button
                    onClick={() => navigate("/employee/therapists")}
                    className="text-2xl font-bold hover:underline"
                >
                    ← Back
                </button>
            </div>


            <div className="flex flex-col bg-indigo-200 min-h-screen  p-4">
                <div className="flex flex-row">
                    <img
                        src={"/assets/Cat_November_2010-1a.jpg"}
                        alt="Therapist"
                        className="w-full max-h-[300px] aspect-[3/4] object-contain rounded-md"
                    />

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold leading-none">
                                {therapist.user?.firstName} {therapist.user?.lastName}
                            </h1>
                            <span className="text-lg text-gray-600 mt-[2px]">{age} de ani</span>
                        </div>


                        <p className="text-justify">
                            {therapist.description}
                        </p>
                    </div>

                    <div className="m-8">
                        <h1 className="text-large font-bold">
                            Detalii de contact
                        </h1>

                        <div className="flex items-center space-x-2">
                            <FaPhone className="text-gray-600" />
                            <span className="text-gray-700 truncate">
                                {therapist.user?.phoneNumber}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-gray-500" />
                            <span className="text-gray-700 truncate">
                                {therapist.user?.email}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FaFacebook className="text-gray-600" />
                            <a href={therapist.facebook} className="text-blue-500 hover:underline truncate">
                                {therapist.facebook}
                            </a>
                        </div>


                        <div className="flex items-center space-x-2">
                            <FaLinkedin className="text-gray-700" />
                            <a href={therapist.linkedin} className="text-blue-500 hover:underline truncate">
                                {therapist.linkedin}
                            </a>
                        </div>

                        <div className="flex items-center space-x-2">
                            <FaGlobe className="text-gray-700" />
                            <a href={therapist.website} className="text-blue-500 hover:underline truncate">
                                {therapist.website}
                            </a>
                        </div>

                        <br></br>

                        {/* Therapy info - formare specializari therapy style */}
                        <div>
                            <h1 className="text-large font-bold">
                                Detalii profesionale
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Formare:</span> {therapist.formation || 'Nespecificat'}
                            </p>

                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Specializări:</span> {specializations || 'Nespecificate'}
                            </p>

                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Abordare terapeutică:</span> {therapist.therapyStyle || "Nespecificat"}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Calendar cu intervalele libere din fiecare zi highlighted */}
                <div className="w-full flex justify-evenly items-center">

                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-lg font-bold mb-2">
                            Calendar disponibilitate
                        </h2>

                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName={({ date }) => {
                                return availableDates.includes(date.toDateString()) ? 'highlight-available' : null
                            }}
                        />
                    </div>

                    {intervalsForSelectedDate.length > 0 ? (
                        <div className="flex flex-col justify-center items-center">
                            <div className="bg-indigo-400 rounded-lg px-6 py-4 shadow-md w-fit text-center">
                                <h3 className="text-center text-large font-semibold text-black">
                                    Intervale disponibile pe {selectedDate.toLocaleDateString("ro-RO")}
                                </h3>

                                <ul className="flex flex-col gap-3 mt-4 ">
                                    {intervalsForSelectedDate.map(interval => {
                                        const isSelected = selectedInterval?.id === interval.id;

                                        return (
                                            <li key={interval.id} >
                                                <button
                                                    onClick={() => setSelectedInterval(interval)}
                                                    className={`px-4 py-2 rounded-md border ${isSelected
                                                        ? 'bg-indigo-700 text-white border-indigo-500'
                                                        : 'bg-white hover:bg-indigo-100 text-gray-800 border-gray-300'
                                                        }`}
                                                >
                                                    {interval.beginTime.slice(0, 5)} - {interval.endTime.slice(0, 5)}
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>

                            </div>

                            <div className="p-8">
                                <button
                                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                    onClick={() => setShowModal(true)}
                                >
                                    Programează-te
                                </button>

                                {showModal && selectedInterval && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                        <div
                                            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <h2 className="text-xl font-bold mb-4 text-center">Confirmare programare</h2>

                                            <p className="text-gray-700 mb-6 text-center">
                                                Vrei să te programezi în intervalul <strong>{selectedInterval.beginTime.slice(0, 5)} - {selectedInterval.endTime.slice(0, 5)}</strong> pe data de <strong>{selectedDate.toLocaleDateString("ro-RO")}</strong>?
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
                                                        if (selectedInterval && therapist && employee?.id) {
                                                            console.log({
                                                                locationType: "online",
                                                                intervalId: selectedInterval.id,
                                                                specialistId: therapist.id,
                                                                notes: "nimic",
                                                                employeeId: employee.id
                                                            })
                                                            dispatch(
                                                                createTherapySession({
                                                                    locationType: "online",
                                                                    intervalId: selectedInterval.id,
                                                                    specialistId: therapist.id,
                                                                    notes: "nimic",
                                                                    employeeId: employee.id
                                                                })
                                                             
                                                            ).then(() => {
                                                                dispatch(updateIntervalStatus({ id: selectedInterval.id, status: true }));

                                                            });
                                                            console.log("Programare confirmată!");
                                                        } else {
                                                            console.warn("Date insuficiente pentru a crea sesiunea!");
                                                        }
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

                    ) : (
                        <p className="mt-4 text-gray-500">Niciun interval disponibil în această zi.</p>
                    )}



                </div>




            </div>
        </>





    )
}

export default TherapistDetails;