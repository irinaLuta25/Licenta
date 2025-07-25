import './AvailabilityCalendar.css';
import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { getTherapistById, getIntervalsForTherapist, resetSelectedTherapist } from "../../features/therapists/therapistsSlice";
import { createTherapySession, getAllTherapySessionsBySpecialistId } from "../../features/therapySessions/therapySessionsSlice"
import { getEmployeeByUserId } from "../../features/employee/employeeSlice";
import { updateIntervalStatus } from "../../features/interval/intervalSlice"
import { useDispatch, useSelector } from "react-redux";
import { FaLinkedin, FaFacebook, FaGlobe, FaPhone, FaEnvelope, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from "framer-motion";


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


    const allSessions = useSelector((state) => state.therapySessions.list);
    console.log("allS", allSessions)


    console.log("user: ", user)
    console.log("employee: ", employee)

    const navigate = useNavigate();

    const modalRef = useRef();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                setShowModal(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);


    useEffect(() => {
        dispatch(getTherapistById(id));
        dispatch(getIntervalsForTherapist(id));
    }, [dispatch, id]);


    useEffect(() => {
        if (user?.id) {
            console.log("USER din useEffect:", user);
            dispatch(getEmployeeByUserId(user.id));
        }
    }, [dispatch, user]);


    useEffect(() => {
        if (therapist?.id) {
            dispatch(getAllTherapySessionsBySpecialistId(therapist.id));
        }
    }, [dispatch, therapist]);



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

    let specialization = therapist.specialization;

    console.log("Therapist " + id + ":", therapist)
    console.log(freeIntervals)

    const availableDates = freeIntervals.map(interval => new Date(interval.date).toDateString())

    const selectedDateString = selectedDate.toDateString()
    const intervalsForSelectedDate = freeIntervals.filter(interval => {
        const intervalDateString = new Date(interval.date).toDateString()
        return intervalDateString === selectedDateString
    })

    const averageSatisfaction = allSessions.length
        ? allSessions.reduce((acc, s) => acc + (s.satisfactionScore || 0), 0) / allSessions.length
        : 0;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

        return (
            <div className="flex items-center text-indigo-700 text-xl gap-1">
                {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
                {hasHalf && <FaStarHalfAlt key="half" />}
                {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
                <span className="text-md text-gray-700 ml-2">({rating.toFixed(1)} / 5)</span>
            </div>
        );
    };

    



    return (
        <div>


            <div className="bg-indigo-700 text-white px-6 py-3 pb-4 flex justify-between items-center shadow-md">
                <button
                    onClick={() => navigate("/employee/therapists")}
                    className="text-2xl font-bold hover:underline"
                >
                    ← Înapoi
                </button>
            </div>


            <div className="flex flex-col bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] backdrop-blur-lg min-h-screen">
                <div className="m-8 flex flex-row gap-10">

                    <div className="flex flex-row gap-10 bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-2xl rounded-xl p-8">
                        <img
                            src={therapist?.user?.profileImage || "/assets/pfp.jpeg"}
                            alt="Therapist"
                            className="w-auto max-h-[300px] object-cover rounded-lg"
                        />

                        <div className="flex flex-col gap-5">


                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold leading-none">
                                    {therapist.user?.firstName} {therapist.user?.lastName}
                                </h1>
                                <span className="text-lg text-gray-600 mt-[2px]">{age} de ani</span>
                            </div>


                            <p className="text-justify">
                                {therapist.description}
                            </p>

                            {allSessions.length > 0 && (
                                <div className="mt-20">
                                    {renderStars(averageSatisfaction)}
                                </div>
                            )}

                        </div>

                    </div>

                    <div className="bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-2xl rounded-xl p-8">
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

                        <div>
                            <h1 className="text-large font-bold">
                                Detalii profesionale
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Formare:</span> {therapist.formation || 'Nespecificat'}
                            </p>

                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Specializare:</span> {specialization || 'Nespecificată'}
                            </p>

                            <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-700">Abordare terapeutică:</span> {therapist.therapyStyle || "Nespecificat"}
                            </p>
                        </div>

                    </div>
                </div>



                <div className="flex flex-row gap-10 mx-8 pb-8">

                    <div className="w-[40%] min-h-[350px] flex flex-col gap-4 items-center text-center bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-2xl rounded-xl px-8 pt-4">
                        <h3 className="text-lg font-semibold text-indigo-800">Planifică o sesiune de terapie</h3>
                        <p className="text-sm text-gray-700">
                            Alege o zi din calendar și rezervă un interval disponibil pentru a începe călătoria ta spre echilibru și bunăstare.
                        </p>
                        <img src="/assets/aa.png" alt="Ilustrație meditație" className="w-64 h-64 mb-4 " />
                    </div>

                    <div className="w-[35%] min-h-[350px] flex flex-col">

                        <Calendar
                            className="custom-calendar"
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName={({ date }) => {
                                return availableDates.includes(date.toDateString()) ? 'highlight-available' : null
                            }}
                        />
                    </div>

                    {intervalsForSelectedDate.length > 0 ? (
                        <div className="w-[25%] min-h-[350px] flex flex-col items-center bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-2xl rounded-xl p-8 text-center">
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

                            <div className="p-8">
                                <button
                                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                    onClick={() => {
                                        if (!selectedInterval) {
                                            toast.warn("Selectează un interval înainte de a continua!");
                                            return;
                                        }
                                        setShowModal(true);
                                    }}
                                >
                                    Programează-te
                                </button>



                            </div>

                        </div>

                    ) : (
                        <div className="w-[25%] min-h-[350px] bg-gradient-to-br from-[#d4ccff]/70 via-[#c7dfff]/70 to-[#d6e6ff]/70 backdrop-blur-xl shadow-2xl rounded-xl p-8 text-center">
                            <p className="text-gray-600 italic text-center">Niciun interval disponibil în această zi.</p>
                        </div>
                    )}

                </div>

            </div>

            {showModal && selectedInterval && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            ref={modalRef}
                            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
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
                                    onClick={async () => {
                                        if (selectedInterval && therapist && employee?.id) {
                                            try {
                                                await dispatch(createTherapySession({
                                                    intervalId: selectedInterval.id,
                                                    specialistId: therapist.id,
                                                    employeeId: employee.id
                                                })).unwrap();

                                                toast.success("Programare efectuată cu succes!");

                                                await dispatch(updateIntervalStatus({ id: selectedInterval.id, status: true })).unwrap();
                                                await dispatch(getIntervalsForTherapist(therapist.id)).unwrap();
                                            } catch (err) {
                                                toast.error("Eroare la programare.");
                                            }
                                        } else {
                                            console.warn("Date insuficiente pentru a crea sesiunea!");
                                        }
                                        setShowModal(false);
                                    }}
                                >
                                    Da, confirmă
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

            )
            }
        </div>
    )
}



export default TherapistDetails;