import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTherapists } from "../../features/therapists/therapistsSlice";
import TherapistCard from "../../components/TherapistCard/TherapistCard";
import Navbar from "../../components/Navbar";

function Therapists() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name-asc");
    const [genderFilter, setGenderFilter] = useState("");
    const [formationFilter, setFormationFilter] = useState("");


    const dispatch = useDispatch();

    const therapists = useSelector((state) => state.therapists.list);
    const status = useSelector((state) => state.therapists.status);
    const error = useSelector((state) => state.therapists.error);

    useEffect(() => {
        dispatch(getAllTherapists());
    }, [dispatch]);

    const filteredAndSortedTherapists = [...therapists]
        .filter((t) =>
            `${t.user?.firstName} ${t.user?.lastName} ${t.user?.email}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .filter((t) => {
            if (genderFilter && t.user.gender !== genderFilter) return false;
            if (formationFilter && t.formation !== formationFilter) return false;
            return true;
        })
        .sort((a, b) => {
            const nameA = `${a.user.firstName} ${a.user.lastName}`.toLowerCase();
            const nameB = `${b.user.firstName} ${b.user.lastName}`.toLowerCase();

            if (sortOption === "name-asc") return nameA.localeCompare(nameB);
            if (sortOption === "name-desc") return nameB.localeCompare(nameA);
            return 0;
        });


    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Error: {error}</p>;

    return (
        <>
            <Navbar />

            <div className="pt-10 px-8 sm:px-16 bg-gradient-to-br from-[#c1f7dc] via-[#b2d8f3] to-[#c7b5ff] backdrop-blur-lg min-h-screen">

                <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-4 flex-grow">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search therapist..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                        {/* Sortare */}
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="border border-gray-300 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="name-asc">Nume A-Z</option>
                            <option value="name-desc">Nume Z-A</option>
                        </select>

                        {/* Filter Gen */}
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="border border-gray-300 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl px-3 py-2"
                        >
                            <option value="">Gen</option>
                            <option value="feminin">Feminin</option>
                            <option value="masculin">Masculin</option>
                            <option value="altul">Altul</option>
                        </select>

                        {/* FilterFormare */}
                        <select
                            value={formationFilter}
                            onChange={(e) => setFormationFilter(e.target.value)}
                            className="border border-gray-300 shadow-xl hover:shadow-2xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] drop-shadow-lg rounded-xl px-3 py-2"
                        >
                            <option value="">Formare</option>
                            <option value="CBT">CBT</option>
                            <option value="Psihanaliză">Psihanaliză</option>
                            <option value="Terapie sistemică">Terapie sistemică</option>
                        </select>
                    </div>

                    {/* Compatibility Search */}
                    <button
                        onClick={() => alert("Deschide formularul de compatibilitate ✨")}
                        className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] drop-shadow-md rounded-md hover:brightness-110 font-semibold px-4 py-2 transition duration-200 flex items-center gap-2"
                    >
                        <span>✨</span>
                        Compatibility Search
                        <span>✨</span>
                    </button>
                </div>

                {/* Terapeuti grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9 ">
                    {filteredAndSortedTherapists.map((therapist) => (
                        <TherapistCard key={therapist.id} therapist={therapist} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Therapists;
