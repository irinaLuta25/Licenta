import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import FeedbackModal from "../components/FeedbackModal";
import {
    getAllTherapySessionsBySpecialistId,
    updateTherapySession,
} from "../features/therapySessions/therapySessionsSlice";
import {
    getQuestionsByTherapySessionId,
    createQuestionForTherapySession,
    updateQuestion,
    getAllQuestions
} from "../features/question/questionSlice";
import { FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


const defaultProfile = "/assets/Default_pfp.jpg";

function Clients() {
    const dispatch = useDispatch();
    const modalRef = useRef();

    const { list: sessions } = useSelector((state) => state.therapySessions);
    const { user } = useSelector((state) => state.auth);
    const storeQuestions = useSelector((state) => state.question.list || []);

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedClientIds, setExpandedClientIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [questionSession, setQuestionSession] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [editNotes, setEditNotes] = useState({});
    const [noteInput, setNoteInput] = useState({});

    useEffect(() => {
        if (user?.id) {
            dispatch(getAllTherapySessionsBySpecialistId(user.id));
            dispatch(getAllQuestions());
        }
    }, [dispatch, user]);

    const formatDateRO = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("ro-RO");
    };

    const formatTimeRange = (begin, end) => {
        const format = (t) => t?.slice(0, 5) || "";
        return `${format(begin)} - ${format(end)}`;
    };

    const groupedClients = sessions.reduce((acc, session) => {
        const emp = session.employee;
        const user = emp?.user;
        if (!user) return acc;

        if (!acc[user.id]) {
            acc[user.id] = {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                department: emp.department,
                profileImage: user.profileImage || defaultProfile,
                sessions: [],
            };
        }

        acc[user.id].sessions.push({
            ...session,
            date: session.interval?.date,
            time: formatTimeRange(session.interval?.beginTime, session.interval?.endTime),
        });

        return acc;
    }, {});

    const clients = Object.values(groupedClients);

    const filteredClients = clients.filter(
        (client) =>
            client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedClientIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const openFeedbackModal = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const closeFeedbackModal = () => {
        setShowModal(false);
        setSelectedSession(null);
    };

    const isFuture = (dateStr) => new Date(dateStr) > new Date();

    const openQuestionModal = async (session) => {
        setQuestionSession(session);
        setShowQuestionModal(true);
        await dispatch(getQuestionsByTherapySessionId(session.id));
    };

    const closeQuestionModal = () => {
        setShowQuestionModal(false);
        setQuestionSession(null);
        setQuestions([]);
    };

    useEffect(() => {
        if (showQuestionModal && questionSession) {
            const current = storeQuestions.filter(q => q.therapySessionId === questionSession.id);
            setQuestions(current.map(q => ({ id: q.id, text: q.text })));
        }
    }, [showQuestionModal, questionSession, storeQuestions]);

    const addQuestion = () => {
        setQuestions((prev) => [...prev, { id: null, text: "" }]);
    };

    const updateQuestionText = (index, value) => {
        setQuestions((prev) => {
            const updated = [...prev];
            updated[index].text = value;
            return updated;
        });
    };

    const handleSubmitQuestions = async () => {
        for (const q of questions) {
            if (q.text.trim() === "") continue;

            if (q.id) {
                await dispatch(updateQuestion({ id: q.id, text: q.text }));
            } else {
                await dispatch(createQuestionForTherapySession({
                    text: q.text,
                    therapySessionId: questionSession.id,
                }));
            }
        }
        closeQuestionModal();
    };

    const hasQuestionsForSession = (sessionId) =>
        storeQuestions.some(q => q.therapySessionId === sessionId);

    const toggleEditNote = (sessionId, currentNote) => {
        setEditNotes(prev => ({ ...prev, [sessionId]: true }));
        setNoteInput(prev => ({ ...prev, [sessionId]: currentNote }));
    };

    const cancelEditNote = (sessionId) => {
        setEditNotes(prev => ({ ...prev, [sessionId]: false }));
        setNoteInput(prev => {
            const newState = { ...prev };
            delete newState[sessionId];
            return newState;
        });
    };

    const saveNote = async (sessionId) => {
        const text = noteInput[sessionId]?.trim();
        if (text) {
            await dispatch(updateTherapySession({ therapySessionId: sessionId, updates: { notes: text } }));
            await dispatch(getAllTherapySessionsBySpecialistId(user.id));
        }
        cancelEditNote(sessionId);
    };

    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800 p-6">
            <Navbar />
            <div className="mx-14 mt-24">
                <div className="relative w-full sm:w-96 mb-14">
                    <input
                        type="text"
                        placeholder="Caută client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/70 text-indigo-800 placeholder:text-indigo-600 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-2/3 w-full">
                        {filteredClients.map((client) => (
                            <div key={client.id} className="bg-white/70 backdrop-blur rounded-2xl shadow-xl p-8 mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={client.profileImage} alt="Profil" className="w-16 h-16 rounded-full object-cover shadow-md" />
                                        <div>
                                            <h2 className="text-2xl font-bold text-indigo-800">{client.name}</h2>
                                            <p className="text-md text-gray-600">{client.email} – {client.department}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleExpand(client.id)}
                                        className="text-lg px-4 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        {expandedClientIds.includes(client.id) ? "Ascunde sesiuni" : "Vezi sesiuni"}
                                    </button>
                                </div>

                                {expandedClientIds.includes(client.id) && (
                                    <div className="mt-4 space-y-6">
                                        {/* Ședințe viitoare */}
                                        {client.sessions.filter(s => isFuture(s.date)).length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-indigo-800 mb-2">Programări viitoare</h3>
                                                <div className="space-y-4">
                                                    {client.sessions
                                                        .filter(s => isFuture(s.date))
                                                        .map((session) => (
                                                            <div key={session.id} className="bg-white border border-indigo-200 rounded-xl p-6 shadow-md">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-lg font-medium text-indigo-800">📅 {formatDateRO(session.date)}</p>
                                                                    <p className="text-lg font-medium text-indigo-800">🕰️ {session.time}</p>
                                                                    <button
                                                                        onClick={() => openQuestionModal(session)}
                                                                        className="px-3 py-1 bg-indigo-500 text-white text-md rounded hover:bg-indigo-600"
                                                                    >
                                                                        {hasQuestionsForSession(session.id) ? "Editează întrebări feedback" : "Încarcă întrebări feedback"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Ședințe trecute */}
                                        {client.sessions.filter(s => !isFuture(s.date)).length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-indigo-800 mb-2">Programări trecute</h3>
                                                <div className="space-y-4">
                                                    {client.sessions
                                                        .filter(s => !isFuture(s.date))
                                                        .map((session) => (
                                                            <div key={session.id} className="bg-white border border-indigo-200 rounded-xl p-6 shadow-md">
                                                                <div className="flex justify-between items-center">
                                                                    <p className="text-lg font-medium text-indigo-800">📅 {formatDateRO(session.date)}</p>
                                                                    <p className="text-lg font-medium text-indigo-800">🕰️ {session.time}</p>
                                                                    <button
                                                                        onClick={() => openFeedbackModal(session)}
                                                                        className="px-3 py-1 bg-indigo-500 text-white text-md rounded hover:bg-indigo-600"
                                                                    >
                                                                        Vezi feedback
                                                                    </button>
                                                                </div>

                                                                <p className="text-md font-semibold mt-4 text-indigo-700">Notițele mele</p>
                                                                {!editNotes[session.id] ? (
                                                                    <div className="mt-1 bg-indigo-50 p-3 rounded flex justify-between items-start">
                                                                        <p className="text-sm whitespace-pre-wrap">{session.notes || "Nicio notiță adăugată."}</p>
                                                                        <button
                                                                            onClick={() => toggleEditNote(session.id, session.notes || "")}
                                                                            className="ml-4 text-indigo-800 hover:text-indigo-600"
                                                                            title="Editează notița"
                                                                        >
                                                                            <FaEdit size={18} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2">
                                                                        <textarea
                                                                            className="w-full border rounded p-2"
                                                                            value={noteInput[session.id]}
                                                                            onChange={(e) =>
                                                                                setNoteInput((prev) => ({
                                                                                    ...prev,
                                                                                    [session.id]: e.target.value,
                                                                                }))
                                                                            }
                                                                        />
                                                                        <div className="flex gap-2 mt-2">
                                                                            <button
                                                                                onClick={() => saveNote(session.id)}
                                                                                className="bg-indigo-600 text-white px-3 py-1 rounded"
                                                                            >
                                                                                Salvează
                                                                            </button>
                                                                            <button
                                                                                onClick={() => cancelEditNote(session.id)}
                                                                                className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                                                                            >
                                                                                Anulează
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>

                    <div className="lg:w-1/3 w-full bg-white/70 rounded-2xl shadow-xl p-10 pb-20 flex flex-col gap-4 h-fit">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Sumar activitate</h2>
                        <div className="text-xl text-gray-800 space-y-4">
                            <p className="font-semibold">👥 Număr clienți: <span className="font-bold text-indigo-800">{clients.length}</span></p>
                            <p className="font-semibold">📅 Număr total sesiuni: <span className="font-bold text-indigo-800">{sessions.length}</span></p>
                            <p className="font-semibold">⭐ Scor satisfacție mediu: <span className="font-bold text-indigo-800">{(sessions.reduce((acc, s) => acc + (s.satisfactionScore || 0), 0) / sessions.length || 0).toFixed(1)} / 5</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && <FeedbackModal session={selectedSession} onClose={closeFeedbackModal} />}
            {showQuestionModal && (
                <AnimatePresence>
                    <motion.div
                        onMouseDown={(e) => {
                            if (modalRef.current && !modalRef.current.contains(e.target)) {
                                closeQuestionModal();
                            }
                        }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            ref={modalRef}
                            className="bg-white rounded-2xl p-10 w-full max-w-3xl shadow-xl relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeQuestionModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-bold mb-10 text-indigo-800 text-center">Formular feedback</h2>
                            <div className="mb-6 text-black text-md space-y-1">
                                <p><b>Client:</b> {questionSession?.employee?.user?.firstName} {questionSession?.employee?.user?.lastName}</p>
                                <p><b>Data:</b> {formatDateRO(questionSession?.interval?.date)}</p>
                                <p><b>Interval orar:</b> {formatTimeRange(questionSession?.interval?.beginTime, questionSession?.interval?.endTime)}</p>
                            </div>
                            <div className="space-y-4 mb-6">
                                {questions.map((q, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        value={q.text}
                                        onChange={(e) => updateQuestionText(idx, e.target.value)}
                                        className="w-full p-3 bg-indigo-100 border-l-4 border-indigo-400 rounded-md shadow-sm rounded-xl text-gray-700 placeholder-gray-500 focus:outline-indigo-600 shadow-inner"
                                        placeholder={`Întrebare ${idx + 1}`}
                                    />
                                ))}
                                <div className="flex justify-begin">
                                    <button
                                        type="button"
                                        onClick={addQuestion}
                                        className="mt-2 bg-indigo-700 hover:bg-indigo-600 text-white px-5 py-2 rounded-lg shadow transition"
                                    >
                                        + Adaugă întrebare
                                    </button>
                                </div>

                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    onClick={closeQuestionModal}
                                    className="px-5 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Închide
                                </button>
                                <button
                                    onClick={handleSubmitQuestions}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Trimite
                                </button>

                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}

export default Clients;
