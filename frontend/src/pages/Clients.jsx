import { useState } from "react";
import Navbar from "../components/Navbar";
import FeedbackModal from "../components/FeedbackModal";
import { FaQuestion } from "react-icons/fa";

function Clients() {
    const profileImage = "/assets/Default_pfp.jpg";

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedClientIds, setExpandedClientIds] = useState([]);
    const [noteTexts, setNoteTexts] = useState({});
    const [savedNotes, setSavedNotes] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [expandAnonymous, setExpandAnonymous] = useState(false);

    const clients = [
        {
            id: 1,
            name: "Maria Popescu",
            email: "maria.popescu@gmail.com",
            department: "HR",
            sessions: [
                {
                    id: 101,
                    date: "2025-05-20",
                    time: "10:00",
                    notes: "Discutat despre burnout și echilibru muncă-viață.",
                    feedbacks: [
                        { content: "A fost foarte utilă sesiunea.", isAnonymous: false },
                        { content: "Mi-a plăcut deschiderea terapeutului.", isAnonymous: true }
                    ]
                },
                {
                    id: 102,
                    date: "2025-05-15",
                    time: "14:00",
                    notes: null,
                    feedbacks: []
                }
            ]
        },
        {
            id: 2,
            name: "Andrei Ionescu",
            email: "andrei.ionescu@gmail.com",
            department: "IT",
            sessions: []
        }
    ];

    const allAnonymousFeedbacks = clients.flatMap(c =>
        c.sessions?.flatMap(s =>
            s.feedbacks?.filter(f => f.isAnonymous).map(f => ({ content: f.content, session: s, client: c })) || []
        ) || []
    );

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedClientIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleNoteChange = (sessionId, value) => {
        setNoteTexts((prev) => ({ ...prev, [sessionId]: value }));
    };

    const handleNoteSave = (e, sessionId) => {
        e.preventDefault();
        if (noteTexts[sessionId]?.trim()) {
            setSavedNotes((prev) => ({ ...prev, [sessionId]: noteTexts[sessionId] }));
        }
    };

    const openFeedbackModal = (session) => {
        setSelectedSession(session);
        setShowModal(true);
    };

    const closeFeedbackModal = () => {
        setShowModal(false);
        setSelectedSession(null);
    };

    return (
        <div className="bg-gradient-to-br from-[#F1F2D3] via-[#5e8de7] to-[#9f82ec] min-h-screen text-gray-800 p-6">
            <Navbar />

            <div className="mx-14">
                {/* Search bar */}
                <div className="relative w-full sm:w-96 mb-14 mt-24">
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

                {/* Main container: clients + summary */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Stanga */}
                    <div className="lg:w-2/3 w-full">
                        {allAnonymousFeedbacks.length > 0 && (
                            <div className="bg-white/70 border border-indigo-300 shadow-xl rounded-2xl p-8 mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FaQuestion className="text-indigo-800 text-[42px] m-2" />
                                        <h3 className="text-2xl font-bold ml-3 text-indigo-800">Feedback anonim</h3>
                                    </div>
                                    <button
                                        onClick={() => setExpandAnonymous((prev) => !prev)}
                                        className="text-lg px-4 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        {expandAnonymous ? "Ascunde feedback" : "Vezi feedback"}
                                    </button>
                                </div>
                                {expandAnonymous && (
                                    <ul className="mt-4 space-y-3">
                                        {allAnonymousFeedbacks.map((fb, index) => (
                                            <li key={index} className="bg-white border border-indigo-200 rounded-xl p-4 shadow-md text-md text-gray-800">
                                                “{fb.content}”
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {filteredClients.map((client) => (
                            <div key={client.id} className="bg-white/70 backdrop-blur rounded-2xl shadow-xl p-8 mb-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={profileImage} alt="Profil" className="w-16 h-16 rounded-full object-cover shadow-md" />
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
                                    <div className="mt-4 space-y-4">
                                        {client.sessions.length === 0 ? (
                                            <p className="text-lg text-gray-500">Nicio sesiune încă</p>
                                        ) : (
                                            client.sessions.map((session) => (
                                                <div key={session.id} className="bg-white border border-indigo-200 rounded-xl p-8 shadow-md">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-lg font-medium text-indigo-800">🗓️ {session.date} – {session.time}</p>
                                                        <button
                                                            onClick={() => openFeedbackModal(session)}
                                                            className="px-3 py-1 bg-indigo-500 text-white text-md rounded hover:bg-indigo-600"
                                                        >
                                                            Vezi feedback
                                                        </button>
                                                    </div>

                                                    <p className="text-md font-semibold mt-4 text-indigo-700">Notițele mele</p>
                                                    {session.notes || savedNotes[session.id] ? (
                                                        <div className="mt-1 bg-indigo-50 p-3 rounded">
                                                            <p className="text-md">{session.notes || savedNotes[session.id]}</p>
                                                        </div>
                                                    ) : (
                                                        <form onSubmit={(e) => handleNoteSave(e, session.id)} className="mt-2">
                                                            <textarea
                                                                className="w-full border rounded p-2"
                                                                placeholder="Adaugă notițe..."
                                                                value={noteTexts[session.id] || ""}
                                                                onChange={(e) => handleNoteChange(session.id, e.target.value)}
                                                            />
                                                            <button
                                                                type="submit"
                                                                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
                                                            >
                                                                Salvează notițele
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {showModal && <FeedbackModal session={selectedSession} onClose={closeFeedbackModal} />}
                    </div>

                    {/* Dreapta */}
                    <div className="lg:w-1/3 w-full bg-white/70 rounded-2xl shadow-xl p-10 pb-20 flex flex-col gap-4 h-fit">
                        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Sumar activitate</h2>
                        <div className="text-xl text-gray-800 space-y-4">
                            <p className="font-semibold">👥 Număr clienți: <span className="font-bold text-indigo-800">{clients.length}</span></p>
                            <p className="font-semibold">📅 Număr total sesiuni: <span className="font-bold text-indigo-800">{clients.reduce((acc, c) => acc + c.sessions.length, 0)}</span></p>
                            <p className="font-semibold">🕵️‍♂️ Feedback anonim: <span className="font-bold text-indigo-800">{allAnonymousFeedbacks.length} </span></p>
                            <p className="font-semibold">⭐ Scor satisfacție mediu: <span className="font-bold text-indigo-800">4.6 / 5</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Clients;
